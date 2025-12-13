import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

const CreateSaleSchema = z.object({
  seller_id: z.string().uuid(),
  amount: z.number().positive(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              level: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.sale.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sales: sales.map((sale) => ({
          id: sale.id,
          amount: sale.amount.toNumber(),
          created_at: sale.createdAt,
          seller_name: sale.seller.name,
          seller_email: sale.seller.email,
          seller_level: sale.seller.level,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ventas',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = CreateSaleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { seller_id, amount } = validation.data;

    const seller = await prisma.user.findUnique({
      where: { id: seller_id },
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Vendedor no encontrado' },
        { status: 404 }
      );
    }

    const sale = await prisma.sale.create({
      data: {
        sellerId: seller_id,
        amount,
      },
    });

    // Query recursiva
    const chain = await prisma.$queryRaw
      Array<{ id: string; referrer_id: string | null; level: number; depth: number }>
    >`
      WITH RECURSIVE referral_chain AS (
        SELECT id, referrer_id, level, 1 as depth
        FROM users WHERE id = ${seller_id}::uuid
        
        UNION ALL
        
        SELECT u.id, u.referrer_id, u.level, rc.depth + 1
        FROM users u
        JOIN referral_chain rc ON u.id = rc.referrer_id
        WHERE rc.depth < 3
      )
      SELECT * FROM referral_chain ORDER BY depth
    `;

    const rates: { [key: number]: { percentage: number; multiplier: number } } = {
      1: { percentage: 10.0, multiplier: 0.1 },
      2: { percentage: 5.0, multiplier: 0.05 },
      3: { percentage: 2.5, multiplier: 0.025 },
    };

    const commissionsData = chain
      .map((person) => {
        const rate = rates[person.depth];
        if (!rate) return null;

        return {
          saleId: sale.id,
          userId: person.id,
          amount: amount * rate.multiplier,
          percentage: rate.percentage,
          level: person.depth,
        };
      })
      .filter(Boolean);

    await prisma.commission.createMany({
      data: commissionsData as any,
    });

    const createdCommissions = await prisma.commission.findMany({
      where: { saleId: sale.id },
      include: { user: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Venta creada exitosamente',
        data: {
          sale: {
            id: sale.id,
            seller_id: sale.sellerId,
            amount: sale.amount.toNumber(),
            created_at: sale.createdAt,
          },
          commissions: createdCommissions.map((c) => ({
            id: c.id,
            user_id: c.userId,
            user_name: c.user.name,
            amount: c.amount.toNumber(),
            percentage: c.percentage.toNumber(),
            level: c.level,
          })),
          summary: {
            total_sale: amount,
            total_commissions: createdCommissions.reduce(
              (sum, c) => sum + c.amount.toNumber(),
              0
            ),
            commissions_count: createdCommissions.length,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear venta',
        message: error.message,
      },
      { status: 500 }
    );
  }
}