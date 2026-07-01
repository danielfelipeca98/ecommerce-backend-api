import express from 'express'
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js'

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || null;
        const query = req.query.query || null;
        const result = await productManager.getProducts(limit, page, sort, query);
        const products = result.payload || [];
        console.log('Productos a renderizar:', products.length);

        res.render('home', {
            title: 'Inicio',
            products: result.payload,
            pagination: result,
            currentLimit: limit,
            currentSort: sort,
            currentQuery: query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50; 
        const result = await productManager.getProducts(limit);
        const products = result.payload || [];
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar productos');
    }
});
router.get('/products/:pid', async (req, res) => {
    try {
        const dataProduct = await productManager.getProductById(req.params.pid);
        res.render('productDetail', dataProduct)
    } catch (error) {
        console.error('Mensaje:', error.message);
        res.status(404).send('Producto no encontrado');
    }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        console.log('Carrito después de populate:', cart.products.map(p => p.product ? p.product.title : 'null'));
        let total = 0;
        cart.products.forEach(item => {
            item.subtotal = item.product.price * item.quantity;
            total += item.subtotal;
        })
        res.render('cartDetail', { cart, total })
    } catch (error) {
        console.error('Mensaje:', error.message);
        res.status(404).send('Carrito no encontrado');
    }
})

export default router;