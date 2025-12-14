import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Dashboard: Estadísticas generales
export async function fetchCardData() {
  noStore();
  try {
    const salesCountPromise = sql`SELECT COUNT(*) FROM sales`;
    const totalCommissionsPromise = sql`SELECT SUM(amount) FROM commissions`;
    const affiliatesCountPromise = sql`SELECT COUNT(*) FROM users`;

    const data = await Promise.all([
      salesCountPromise,
      totalCommissionsPromise,
      affiliatesCountPromise,
    ]);

    const numberOfSales = Number(data[0].rows[0].count ?? '0');
    const totalCommissionsAmount = Number(data[1].rows[0].sum ?? '0');
    const numberOfAffiliates = Number(data[2].rows[0].count ?? '0');

    return {
      numberOfSales,
      totalCommissionsAmount,
      numberOfAffiliates,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// Comisiones agrupadas por nivel
export async function fetchCommissionsByLevel() {
  noStore();
  try {
    const data = await sql`
      SELECT 
        level,
        COUNT(*) as count,
        SUM(amount) as total
      FROM commissions
      GROUP BY level
      ORDER BY level
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch commissions by level.');
  }
}

// Últimas 5 ventas
export async function fetchLatestSales() {
  noStore();
  try {
    const data = await sql`
      SELECT 
        sales.id,
        sales.amount,
        sales.created_at,
        users.name,
        users.email
      FROM sales
      JOIN users ON sales.seller_id = users.id
      ORDER BY sales.created_at DESC
      LIMIT 5
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest sales.');
  }
}

// Todas las ventas con filtro y paginación
const ITEMS_PER_PAGE = 6;

export async function fetchFilteredSales(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sales = await sql`
      SELECT
        sales.id,
        sales.amount,
        sales.created_at,
        users.name,
        users.email
      FROM sales
      JOIN users ON sales.seller_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        sales.amount::text ILIKE ${`%${query}%`}
      ORDER BY sales.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return sales.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sales.');
  }
}

// Contar páginas de ventas
export async function fetchSalesPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM sales
      JOIN users ON sales.seller_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        sales.amount::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of sales.');
  }
}

// Lista de todos los afiliados
export async function fetchAffiliates() {
  noStore();
  try {
    const data = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.level,
        r.name as referrer_name
      FROM users u
      LEFT JOIN users r ON u.referrer_id = r.id
      ORDER BY u.level DESC, u.created_at DESC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch affiliates.');
  }
}

// Afiliados filtrados por nivel
export async function fetchAffiliatesByLevel(level: number) {
  noStore();
  try {
    const data = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.level,
        r.name as referrer_name,
        COUNT(DISTINCT s.id) as total_sales,
        COALESCE(SUM(c.amount), 0) as total_commissions
      FROM users u
      LEFT JOIN users r ON u.referrer_id = r.id
      LEFT JOIN sales s ON s.seller_id = u.id
      LEFT JOIN commissions c ON c.user_id = u.id
      WHERE u.level = ${level}
      GROUP BY u.id, u.name, u.email, u.level, r.name
      ORDER BY total_commissions DESC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch affiliates by level.');
  }
}

// Obtener un afiliado específico por ID
export async function fetchAffiliateById(id: string) {
  noStore();
  try {
    const data = await sql`
      SELECT
        id,
        name,
        email,
        level,
        referrer_id
      FROM users
      WHERE id = ${id}
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch affiliate.');
  }
}

// Lista de vendedores (nivel 1) para forms
export async function fetchSellers() {
  noStore();
  try {
    const data = await sql`
      SELECT id, name, email
      FROM users
      WHERE level = 1
      ORDER BY name ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sellers.');
  }
}

// Lista de posibles referidores según nivel
export async function fetchPotentialReferrers(level: number) {
  noStore();
  try {
    // Si es nivel 1, puede referir a nivel 2
    // Si es nivel 2, puede referir a nivel 3
    // Si es nivel 3, no tiene referidor
    const referrerLevel = level + 1;

    if (referrerLevel > 3) {
      return [];
    }

    const data = await sql`
      SELECT id, name, email, level
      FROM users
      WHERE level = ${referrerLevel}
      ORDER BY name ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch potential referrers.');
  }
}
