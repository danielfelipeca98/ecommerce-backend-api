import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

import { connectDB } from './config/database.js'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './managers/ProductManager.js'

dotenv.config()

const app = express();
const PORT = 8080;

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager();

io.on('connection', socket => {
    console.log('Nuevo usuario conectado')

    socket.on('new-product', async data => {
        try {
            await productManager.addProduct(data)
            const result = await productManager.getProducts(0);
            io.emit('update-products', result.payload);
            console.log('producto agregado correctamente');
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    })

    socket.on('delete-product', async id => {
        console.log('ID recibido para eliminar:', id);
        try {
            const deleted = await productManager.deleteProduct(id)
            console.log('Producto eliminado:', deleted);

            const result = await productManager.getProducts(0)
            console.log('Después de eliminar, productos en DB:', result.payload.length);

            io.emit('update-products', result.payload);
            console.log('producto eliminado correctamente');

        } catch (error) {
            console.error('Error al agregar producto:', error);

        }
    })

    socket.on('disconnect', () => {
        console.log('usuario desconectado')
    })
})

try {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Servidor en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
}