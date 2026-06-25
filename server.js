const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const PORT = 8080;

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main'}));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const io = new Server(server);

const ProductManager = require('./managers/ProductManager.js')
const productManager = new ProductManager();

io.on('connection', socket => {
    console.log('Nuevo usuario conectado')

    socket.on('new-product', async data => {
        try {
            await productManager.addProduct(data)

            const products = await productManager.getProducts();

            io.emit('update-products', products);

            console.log('producto agregado correctamente');
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    })

    socket.on('delete-product', async id => {
        try {
            await productManager.deleteProduct(id)

            const products = await productManager.getProducts()
            io.emit('update-products', products);

            console.log('producto eliminado correctamente');
        } catch (error) {
            console.error('Error al agregar producto:', error);

        }
    })

    socket.on('disconnect', () => {
        console.log('usuario desconectado')
    })
})

 server.listen(PORT, () => {
    console.log(`servidor en http://localhost:${PORT}`);
});