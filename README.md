# Sistema de Comisiones Interplay

Sistema de gestión de comisiones multinivel para equipos de ventas. Permite registrar ventas, gestionar afiliados y calcular comisiones automáticamente hasta 3 niveles de referidos.

## Características

- **Dashboard de Comisiones**: Visualización en tiempo real de comisiones y ventas
- **Gestión de Afiliados**: Sistema de 3 niveles de afiliados con estructura de referidos
- **Registro de Ventas**: Creación y seguimiento de ventas con cálculo automático de comisiones
- **Sistema de Autenticación**: Login seguro con NextAuth v5
- **Cálculo Automático**: Las comisiones se calculan automáticamente según el nivel:
  - Nivel 1: 10% de la venta
  - Nivel 2: 5% de la venta
  - Nivel 3: 2.5% de la venta

## Stack Tecnológico

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: NextAuth v5
- **Estilos**: Tailwind CSS
- **ORM**: SQL directo con `@vercel/postgres` y `postgres`
- **Validación**: Zod
- **Iconos**: Heroicons

## Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta en Neon (PostgreSQL) o cualquier base de datos PostgreSQL

## Configuración del Proyecto

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd interplay-comisiones
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Autenticación NextAuth
AUTH_SECRET=tu-secret-key-aqui
AUTH_URL=http://localhost:3000

# Base de Datos PostgreSQL
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require
POSTGRES_URL=postgresql://usuario:password@host/database?sslmode=require
```

#### Generar AUTH_SECRET

Puedes generar un secret seguro con:

```bash
openssl rand -base64 32
```

### 4. Configurar la base de datos

Ejecuta el siguiente script SQL en tu base de datos PostgreSQL para crear las tablas necesarias:

```sql
-- Crear tabla de usuarios (afiliados)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  referrer_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de ventas
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de comisiones
CREATE TABLE commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_sales_seller ON sales(seller_id);
CREATE INDEX idx_commissions_user ON commissions(user_id);
CREATE INDEX idx_commissions_sale ON commissions(sale_id);
CREATE INDEX idx_users_referrer ON users(referrer_id);
```

### 5. Crear un usuario de prueba

Para poder iniciar sesión, necesitas crear al menos un usuario. Ejecuta este script SQL (la contraseña será `123456`):

```sql
INSERT INTO users (name, email, password, level, referrer_id)
VALUES ('Admin', 'admin@test.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', 1, NULL);
```

O puedes crear tu propio usuario con una contraseña hasheada usando bcrypt en Node.js:

```javascript
const bcrypt = require('bcrypt');
const password = await bcrypt.hash('tu-password', 10);
console.log(password);
```

## Ejecutar el Proyecto

### Modo Desarrollo

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
interplay-comisiones/
├── app/
│   ├── dashboard/          # Páginas del dashboard
│   │   ├── (overview)/     # Vista general
│   │   ├── affiliates/     # Gestión de afiliados
│   │   ├── sales/          # Gestión de ventas
│   │   └── levels/         # Vistas por nivel
│   ├── lib/                # Utilidades y acciones
│   │   ├── actions.ts      # Server Actions
│   │   ├── data.ts         # Queries a la BD
│   │   └── definitions.ts  # Tipos TypeScript
│   ├── login/              # Página de login
│   └── ui/                 # Componentes UI
├── auth.config.ts          # Configuración NextAuth
├── auth.ts                 # Setup NextAuth
└── .env                    # Variables de entorno
```

## Uso del Sistema

### Iniciar Sesión

1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa tus credenciales
3. Serás redirigido al dashboard

### Crear un Afiliado

1. Ve a "Afiliados" en el menú lateral
2. Haz clic en "Crear Afiliado"
3. Completa el formulario:
   - Nombre
   - Email
   - Contraseña
   - Nivel (1, 2 o 3)
   - Referidor (opcional)

### Registrar una Venta

1. Ve a "Ventas" en el menú lateral
2. Haz clic en "Crear Venta"
3. Selecciona el vendedor
4. Ingresa el monto
5. Las comisiones se calcularán automáticamente

### Ver Comisiones por Nivel

- Usa los enlaces "Nivel 1", "Nivel 2", "Nivel 3" en el menú para filtrar por nivel
