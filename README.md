# Boxful Shipping App

Aplicacion web para el sistema de envios de Boxful. Desarrollada con Next.js, Ant Design y Tailwind CSS.

## Tecnologias

- **Next.js 16** — Framework React (App Router)
- **TypeScript** — Tipado estatico
- **Ant Design 6** — Componentes UI
- **Tailwind CSS 4** — Estilos utilitarios
- **Axios** — Cliente HTTP

## Requisitos

- Node.js 18+
- pnpm
- Backend API corriendo en `http://localhost:3001`

## Instalacion

```bash
# Clonar el repositorio
git clone <repo-url>
cd boxful-shipping-app

# Instalar dependencias
pnpm install

# Configurar variables de entorno (opcional)
cp .env.example .env.local
# Editar si la API corre en otro puerto/host
```

## Variables de entorno

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base de la API | `http://localhost:3001/api` |

## Ejecucion

```bash
# Desarrollo
pnpm dev

# Build de produccion
pnpm build
pnpm start
```

La aplicacion estara disponible en `http://localhost:3000`.

## Docker

### Con Docker Compose (solo frontend)

```bash
# Construir y levantar el servicio
docker-compose up --build

# Correr en background
docker-compose up -d

# Detener el servicio
docker-compose down
```

**Nota:** Este `docker-compose.yml` solo incluye el servicio frontend. La base de datos y el API deben estar corriendo desde el proyecto `boxful-shipping-api`.

### Con Docker standalone

```bash
# Build de la imagen
docker build -t boxful-shipping-app .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001/api \
  boxful-shipping-app
```

### Configuración de red

Si necesitas que el frontend se comunique con el API a través de Docker, asegúrate de que ambos servicios estén en la misma red:

```bash
# Desde el proyecto boxful-shipping-api
docker-compose up -d

# Desde este proyecto, conectar a la red existente
docker network connect boxful-shipping-api_boxful-network boxful-shipping-app
```

O bien, modifica el `docker-compose.yml` para usar una red externa:

```yaml
networks:
  boxful-network:
    external: true
    name: boxful-shipping-api_boxful-network
```

## Vistas

1. **Login** — Inicio de sesion con email y contrasena
2. **Registro** — Formulario completo con modal de confirmacion de telefono
3. **Crear orden (Paso 1)** — Datos de recoleccion y destinatario + toggle PCE
4. **Crear orden (Paso 2)** — Agregar paquetes con dimensiones y peso
5. **Historial** — Tabla de ordenes con filtros por fecha, paginacion y export CSV

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # AntdRegistry + fuentes
│   ├── page.tsx                # Redirect a /login
│   ├── (auth)/
│   │   ├── layout.tsx          # Layout split 50/50
│   │   ├── login/page.tsx      # Vista 1
│   │   └── register/page.tsx   # Vista 2
│   └── (dashboard)/
│       ├── layout.tsx          # Sidebar + Header + auth guard
│       └── orders/
│           ├── page.tsx        # Vista 5: Historial
│           └── new/page.tsx    # Vistas 3-4: Crear orden
├── components/
│   └── orders/
│       └── OrderSuccessModal.tsx
├── contexts/
│   └── AuthContext.tsx         # Estado de autenticacion
├── lib/
│   └── api.ts                 # Axios con interceptor JWT
└── types/
    └── index.ts               # Interfaces TypeScript
```

## Usuario de prueba

- **Email:** `test@boxful.com`
- **Password:** `Test1234!`

> Requiere haber ejecutado los seeders del backend (`pnpm exec prisma db seed`)
