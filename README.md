#  E-Commerce API

API RESTful para un sistema de e-commerce con gestión de productos, carritos de compra y actualización en tiempo real. Desarrollado con Node.js, Express, MongoDB y WebSockets.

Este proyecto simula una tienda en línea con gestión de productos, carrito de compras y actualización en tiempo real.

---

##  Tecnologías utilizadas

- **Node.js** + **Express** → Servidor y API REST
- **MongoDB Atlas** + **Mongoose** → Base de datos y modelado
- **Handlebars** → Motor de plantillas para las vistas
- **Socket.io** → Comunicación en tiempo real
- **dotenv** → Variables de entorno

---

##  Funcionalidades principales

- CRUD completo de productos
- Carrito de compras persistente (localStorage)
- Actualización en tiempo real con WebSockets
- Paginación, filtros y ordenamiento en productos
- Vistas dinámicas con Handlebars
- Mensajes flotantes (toasts) para feedback de usuario

---

##  Estructura del proyecto



## Instalación

```bash
git clone https://github.com/danielfelipeca98/ecommerce-backend-api
cd TU_REPO
npm install

# Reemplaza con tu URL de MongoDB Atlas
MONGO_URL=mongodb+srv://dfcastrorodriguez_db_user:n14T0Gq9W1hPJKDl@clusterdaniel.gwqqyqq.mongodb.net/?appName=ClusterDaniel
PORT=8080
Ejecutar
node server.js
Abrir en el navegador: http://localhost:8080


### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:pid` | Obtener producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |
| POST | `/api/carts` | Crear carrito |
| GET | `/api/carts/:cid` | Ver carrito |
| POST | `/api/carts/:cid/product/:pid` | Agregar al carrito |

##Vistas

- `/` → Lista de productos
- `/products/:pid` → Detalle de producto
- `/carts/:cid` → Carrito
- `/realtimeproducts` → Panel en tiempo real

##  WebSockets

- `new-product` → Agregar producto
- `delete-product` → Eliminar producto
- `update-products` → Actualizar lista

Autor
Daniel Felipe Castro 
GitHub https://github.com/danielfelipeca98



