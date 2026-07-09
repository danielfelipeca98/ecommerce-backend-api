import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { connectDB } from './config/database.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './managers/ProductManager.js'
import authRouter from './routes/auth.router.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript')
    }
    next()
})

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/api/auth', authRouter)

const server = http.createServer(app)
const io = new Server(server)
const productManager = new ProductManager()

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado')

    // ✅ Función helper para verificar admin dentro del contexto del socket
    const verificarAdmin = (fn) => {
        return async (data) => {
            try {
                const token = socket.handshake.auth.token
                if (!token) {
                    socket.emit('error-message', { message: 'No autenticado' })
                    return
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                if (decoded.role !== 'admin') {
                    socket.emit('error-message', { message: 'Acceso denegado: se requiere rol de administrador' })
                    return
                }
                await fn(data)
            } catch (error) {
                socket.emit('error-message', { message: error.message || 'Error de autenticación' })
            }
        }
    }

    // Evento: crear producto (solo admin)
    socket.on('new-product', verificarAdmin(async (data) => {
        await productManager.addProduct(data)
        const result = await productManager.getProducts(0)
        io.emit('update-products', result.payload)
        console.log('Producto agregado correctamente')
    }))

    // Evento: eliminar producto (solo admin)
    socket.on('delete-product', verificarAdmin(async (id) => {
        console.log('ID recibido para eliminar:', id)
        await productManager.deleteProduct(id)
        const result = await productManager.getProducts(0)
        io.emit('update-products', result.payload)
        console.log('Producto eliminado correctamente')
    }))

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
})

try {
    await connectDB()
    server.listen(PORT, () => {
        console.log(`Servidor en http://localhost:${PORT}`)
    })
} catch (error) {
    console.error('Error al conectar a MongoDB:', error.message)
    process.exit(1)
}