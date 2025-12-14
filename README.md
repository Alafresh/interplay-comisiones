# Sistema de Comisiones - Prueba Técnica

Prueba técnica de un sistema de gestión de comisiones multinivel desarrollado con Next.js.

## 🔗 Demo en Vivo

**[Ver Demo](https://interplay-comisiones-fenxthfft-alafresh16-6023s-projects.vercel.app/)**

---

## 🔑 **Credenciales de Prueba**

Para acceder al demo, utiliza las siguientes credenciales:

```
Email: luis@test.com
Contraseña: 123456
```

---

## Stack Tecnológico

### Frontend
- **Next.js 16** con App Router
- **TypeScript**
- **Tailwind CSS**
- **React Server Components**

### Backend
- **Next.js Server Components**
- **NextAuth v5** (Autenticación)
- **PostgreSQL** (Neon)
- **Server Actions**

## Características Implementadas

- ✅ Dashboard de comisiones con visualización en tiempo real
- ✅ Sistema de autenticación seguro
- ✅ Gestión de afiliados multinivel (3 niveles)
- ✅ Registro y seguimiento de ventas
- ✅ Cálculo automático de comisiones:
  - Nivel 1: 10%
  - Nivel 2: 5%
  - Nivel 3: 2.5%
- ✅ Diseño responsivo con Tailwind CSS

## Instalación Local

```bash
# Clonar el repositorio
git clone <repositorio>
cd interplay-comisiones

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
pnpm dev
```

## Variables de Entorno

```env
AUTH_SECRET=tu-secret-key
AUTH_URL=http://localhost:3000
POSTGRES_URL=tu-conexion-postgresql
DATABASE_URL=tu-conexion-postgresql
```

---

**Desarrollado como prueba técnica**
