import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      level INT NOT NULL CHECK (level IN (1, 2, 3)),
      referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const hashedPassword = await bcrypt.hash('123456', 10);

  const level3 = await sql`
    INSERT INTO users (name, email, password, level)
    VALUES ('Carlos Montoya', 'carlos@test.com', ${hashedPassword}, 3)
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  const carlos_id = level3.rows[0]?.id;
  if (!carlos_id) throw new Error('Failed to create level 3 user');

  const level2_1 = await sql`
    INSERT INTO users (name, email, password, level, referrer_id)
    VALUES ('Ana Rodríguez', 'ana@test.com', ${hashedPassword}, 2, ${carlos_id})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  const ana_id = level2_1.rows[0]?.id;
  if (!ana_id) throw new Error('Failed to create Ana');

  const level2_2 = await sql`
    INSERT INTO users (name, email, password, level, referrer_id)
    VALUES ('Pedro López', 'pedro@test.com', ${hashedPassword}, 2, ${carlos_id})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  const level1_1 = await sql`
    INSERT INTO users (name, email, password, level, referrer_id)
    VALUES ('Luis Fernández', 'luis@test.com', ${hashedPassword}, 1, ${ana_id})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  const luis_id = level1_1.rows[0]?.id;
  if (!luis_id) throw new Error('Failed to create Luis');

  await sql`
    INSERT INTO users (name, email, password, level, referrer_id)
    VALUES ('Sofía Torres', 'sofia@test.com', ${hashedPassword}, 1, ${ana_id})
    ON CONFLICT (email) DO NOTHING;
  `;

  await sql`
    INSERT INTO users (name, email, password, level, referrer_id)
    VALUES ('Diego Ramírez', 'diego@test.com', ${hashedPassword}, 1, ${ana_id})
    ON CONFLICT (email) DO NOTHING;
  `;

  return luis_id;
}

async function seedSales(luisId: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS sales (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const sale1 = await sql`
    INSERT INTO sales (seller_id, amount)
    VALUES (${luisId}, 1000.00)
    RETURNING *;
  `;

  const sale2 = await sql`
    INSERT INTO sales (seller_id, amount)
    VALUES (${luisId}, 500.00)
    RETURNING *;
  `;

  return [sale1.rows[0], sale2.rows[0]];
}

async function seedCommissions(sales: any[]) {
  await sql`
    CREATE TABLE IF NOT EXISTS commissions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL,
      percentage DECIMAL(5, 2) NOT NULL,
      level INT NOT NULL CHECK (level IN (1, 2, 3)),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const sale of sales) {
    const chain = await sql`
      WITH RECURSIVE referral_chain AS (
        SELECT id, referrer_id, level, 1 as depth
        FROM users WHERE id = ${sale.seller_id}
        
        UNION ALL
        
        SELECT u.id, u.referrer_id, u.level, rc.depth + 1
        FROM users u
        JOIN referral_chain rc ON u.id = rc.referrer_id
        WHERE rc.depth < 3
      )
      SELECT * FROM referral_chain ORDER BY depth;
    `;

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

      const commissionAmount = Number(sale.amount) * rate.multiplier;

      await sql`
        INSERT INTO commissions (sale_id, user_id, amount, percentage, level)
        VALUES (
          ${sale.id}, 
          ${person.id}, 
          ${commissionAmount}, 
          ${rate.percentage}, 
          ${depth}
        );
      `;
    }
  }
}

export async function GET() {
  try {
    await sql`DROP TABLE IF EXISTS commissions CASCADE;`;
    await sql`DROP TABLE IF EXISTS sales CASCADE;`;
    await sql`DROP TABLE IF EXISTS users CASCADE;`;

    const luisId = await seedUsers();
    const sales = await seedSales(luisId);
    await seedCommissions(sales);

    return Response.json({
      message: 'Database seeded successfully',
      info: {
        users: '7 users created in 3 levels',
        sales: '2 sales created',
        commissions: 'Calculated automatically (10%, 5%, 2.5%)',
      },
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return Response.json(
      {
        error: error.message || 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}
