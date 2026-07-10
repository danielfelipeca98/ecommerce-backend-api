# E-Commerce API

API RESTful para un sistema de e-commerce con gestión de productos, carritos de compra, autenticación JWT y actualización en tiempo real. Desarrollado con Node.js, Express, MongoDB y WebSockets.

** Demo en vivo:** [https://ecommerce-backend-api-myjl.onrender.com](https://ecommerce-backend-api-myjl.onrender.com)

---

##Tecnologías utilizadas

- **Node.js** + **Express** → Servidor y API REST
- **MongoDB Atlas** + **Mongoose** → Base de datos y modelado
- **JWT** + **Bcrypt** → Autenticación segura
- **Handlebars** → Motor de plantillas para las vistas
- **Socket.io** → Comunicación en tiempo real
- **Cookie-Parser** → Manejo de cookies HttpOnly
- **dotenv** → Variables de entorno

---

## Funcionalidades principales

### Usuarios
- Registro e inicio de sesión con JWT.
- Cookies HttpOnly para mayor seguridad.
- Roles: **user** y **admin** (con diferentes permisos).
- Protección de rutas y vistas según rol.

### Productos
- CRUD completo de productos (crear, listar, ver detalle, actualizar, eliminar).
- Paginación, filtros y ordenamiento.
- Imágenes por defecto para productos sin thumbnail.
- Gestión en tiempo real con Socket.IO (solo administradores).

### Carrito de compras
- Asociado al usuario autenticado.
- Agregar, modificar cantidades, eliminar productos y vaciar carrito.
- Persistencia con localStorage y verificación en backend.

### Vistas dinámicas
- **Home** (`/`) → Lista de productos con paginación.
- **Detalle** (`/products/:pid`) → Información completa del producto.
- **Carrito** (`/carts/:cid`) → Gestión del carrito.
- **Login** (`/login`) y **Registro** (`/register`).
- **Panel admin** (`/realtimeproducts`) → Gestión de productos en tiempo real (solo admin).

### Experiencia de usuario
- Mensajes flotantes (toasts) para feedback visual.
- Diseño responsive (mobile first).
- Botones con efectos hover y active.

---

## Estructura del proyecto

ecommerce-backend-api/
├── config/
│ └── database.js # Conexión a MongoDB
├── managers/ # Lógica de negocio
│ ├── CartManager.js
│ └── ProductManager.js
├── middlewares/ # Middlewares de Express
│ ├── auth.middleware.js # Autenticación JWT
│ └── authView.middleware.js
├── models/ # Modelos de MongoDB
│ ├── cart.model.js
│ ├── products.model.js
│ └── user.model.js
├── public/ # Archivos estáticos
│ ├── css/
│ │ └── styles.css
│ ├── js/ # JavaScript del frontend
│ │ ├── cartDetail.js
│ │ ├── fetchWithAuth.js
│ │ ├── home.js
│ │ ├── login.js
│ │ ├── logout.js
│ │ ├── mainHandlebars.js
│ │ ├── mensajes.js
│ │ ├── productDetail.js
│ │ ├── realTime.js
│ │ └── register.js
│ └── img/ # Imágenes de productos
│ └── default-product.png
├── routes/ # Rutas de la API
│ ├── auth.router.js
│ ├── carts.router.js
│ ├── products.router.js
│ └── views.router.js
├── views/ # Plantillas Handlebars
│ ├── layouts/
│ │ └── main.handlebars # Layout principal
│ ├── cartDetail.handlebars
│ ├── home.handlebars
│ ├── login.handlebars
│ ├── productDetail.handlebars
│ ├── realTimeProducts.handlebars
│ └── register.handlebars
├── .env # Variables de entorno (no subir a GitHub)
├── .gitignore
├── package.json
├── package-lock.json
├── server.js # Punto de entrada de la aplicación
└── README.md # Documentación del proyecto


---
## Notas sobre la estructura

- **`managers/`**: Contiene la lógica de negocio (CRUD de productos y carritos).
- **`middlewares/`**: Middlewares de autenticación (`auth`) y autorización (`esAdmin`).
- **`models/`**: Definición de esquemas de MongoDB con Mongoose.
- **`public/`**: Archivos estáticos (CSS, JS del frontend, imágenes).
- **`routes/`**: Definición de endpoints de la API y rutas de vistas.
- **`views/`**: Plantillas Handlebars para renderizar el frontend.
- **`.env`**: Almacena variables de entorno sensibles (no incluido en el repositorio).

---

##  Endpoints de la API

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/products` | Listar productos | No |
| GET | `/api/products/:pid` | Obtener producto | No |
| POST | `/api/products` | Crear producto | (admin) |
| PUT | `/api/products/:pid` | Actualizar producto |  (admin) |
| DELETE | `/api/products/:pid` | Eliminar producto |  (admin) |
| POST | `/api/carts` | Crear carrito | Si |
| GET | `/api/carts/:cid` | Ver carrito | Si |
| POST | `/api/carts/:cid/product/:pid` | Agregar al carrito | Si |
| PUT | `/api/carts/:cid/products/:pid` | Actualizar cantidad | Si |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito | Si |
| DELETE | `/api/carts/:cid` | Vaciar carrito | Si |

---

##  Vistas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Lista de productos con paginación |
| `/products/:pid` | Detalle de producto |
| `/carts/:cid` | Carrito de compras |
| `/realtimeproducts` | Panel de administración (solo admin) |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |

---

##  Eventos WebSocket

| Evento | Descripción | Permisos |
|--------|-------------|----------|
| `new-product` | Agregar producto en tiempo real | (admin) |
| `delete-product` | Eliminar producto en tiempo real |  (admin) |
| `update-products` | Actualizar lista de productos |  (todos) |
| `error-message` | Mensaje de error desde el servidor |  (todos) |

---

##  Instalación local

### 1. Clonar el repositorio
git clone https://github.com/danielfelipeca98/ecommerce-backend-api
cd ecommerce-backend-api
npm install

# Crea un archivo .env
PORT=8080
MONGO_URL=mongodb+srv://dfcastrorodriguez_db_user:n14T0Gq9W1hPJKDl@clusterdaniel.gwqqyqq.mongodb.net/?appName=ClusterDaniel
JWT_SECRET=Tu_clave

#Crear usuario administrador desde Postman:

Método: POST
URL: http://localhost:8080/api/auth/register
Body (JSON):
{
    "email": "admin@ejemplo.com",
    "password": "admin123",
    "role": "admin"
}

##Cuentas de prueba
| Rol | Email | Contraseña |
|--------|-------------|----------|
| Admin | admin@ejemplo.com | 123456 |
| User | usuario@ejemplo.com |  123456 |

Autor
Daniel Felipe Castro 
GitHub https://github.com/danielfelipeca98



