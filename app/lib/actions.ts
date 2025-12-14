'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const SaleSchema = z.object({
  sellerId: z.string().uuid({
    message: 'Selecciona un vendedor válido',
  }),
  amount: z.coerce.number().gt(0, { message: 'El monto debe ser mayor a 0' }),
});

export type SaleState = {
  errors?: {
    sellerId?: string[];
    amount?: string[];
  };
  message?: string | null;
};

export async function createSale(prevState: SaleState, formData: FormData) {
  const validatedFields = SaleSchema.safeParse({
    sellerId: formData.get('sellerId'),
    amount: formData.get('amount'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. No se pudo crear la venta.',
    };
  }

  const { sellerId, amount } = validatedFields.data;

  try {
    // 1. Crear la venta
    const sale = await sql`
      INSERT INTO sales (seller_id, amount)
      VALUES (${sellerId}, ${amount})
      RETURNING *
    `;

    const saleId = sale.rows[0].id;

    // 2. Obtener cadena de referidos (hasta 3 niveles)
    const chain = await sql`
      WITH RECURSIVE referral_chain AS (
        SELECT id, referrer_id, level, 1 as depth
        FROM users WHERE id = ${sellerId}
        
        UNION ALL
        
        SELECT u.id, u.referrer_id, u.level, rc.depth + 1
        FROM users u
        JOIN referral_chain rc ON u.id = rc.referrer_id
        WHERE rc.depth < 3
      )
      SELECT * FROM referral_chain ORDER BY depth
    `;

    // 3. Calcular y guardar comisiones
    const rates: { [key: number]: { percentage: number; multiplier: number } } =
      {
        1: { percentage: 10.0, multiplier: 0.1 },
        2: { percentage: 5.0, multiplier: 0.05 },
        3: { percentage: 2.5, multiplier: 0.025 },
      };

    for (const person of chain.rows) {
      const depth = Number(person.depth);
      const rate = rates[depth];

      if (!rate) continue;

      const commissionAmount = amount * rate.multiplier;

      await sql`
        INSERT INTO commissions (sale_id, user_id, amount, percentage, level)
        VALUES (
          ${saleId}, 
          ${person.id}, 
          ${commissionAmount}, 
          ${rate.percentage}, 
          ${depth}
        )
      `;
    }
  } catch (error) {
    console.error('Error creating sale:', error);
    return {
      message: 'Error de base de datos: No se pudo crear la venta.',
    };
  }

  revalidatePath('/dashboard/sales');
  redirect('/dashboard/sales');
}

export async function deleteSale(id: string) {
  try {
    // Las comisiones se eliminan automáticamente por CASCADE
    await sql`DELETE FROM sales WHERE id = ${id}`;
    revalidatePath('/dashboard/sales');
    return { message: 'Venta eliminada.' };
  } catch (error) {
    console.error('Error deleting sale:', error);
    return { message: 'Error de base de datos: No se pudo eliminar la venta.' };
  }
}

const AffiliateSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
  level: z.coerce
    .number()
    .int()
    .min(1)
    .max(3, { message: 'Nivel debe ser 1, 2 o 3' }),
  referrerId: z.string().uuid().nullable(),
});

export type AffiliateState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    level?: string[];
    referrerId?: string[];
  };
  message?: string | null;
};

export async function createAffiliate(
  prevState: AffiliateState,
  formData: FormData
) {
  const validatedFields = AffiliateSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    level: formData.get('level'),
    referrerId: formData.get('referrerId') || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. No se pudo crear el afiliado.',
    };
  }

  const { name, email, password, level, referrerId } = validatedFields.data;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, level, referrer_id)
      VALUES (${name}, ${email}, ${hashedPassword}, ${level}, ${referrerId})
    `;
  } catch (error: any) {
    console.error('Error creating affiliate:', error);

    if (error?.message?.includes('duplicate key')) {
      return {
        message: 'Error: Ya existe un usuario con ese email.',
      };
    }

    return {
      message: 'Error de base de datos: No se pudo crear el afiliado.',
    };
  }

  revalidatePath('/dashboard/affiliates');
  redirect('/dashboard/affiliates');
}

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const redirectTo = formData.get('redirectTo')?.toString() || '/dashboard';
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas.';
        default:
          return 'Algo salió mal.';
      }
    }
    throw error;
  }
}
