import express from 'express'
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js'
import auth, {esAdmin} from '../middlewares/auth.middleware.js';

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

router.get('/realtimeproducts', auth, esAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50; 
        const result = await productManager.getProducts(limit);
        const products = result.payload || [];
        res.render('realTimeProducts', { products,user: req.user  });
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

router.get('/carts/:cid', auth,async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid, req.user.id);
        
        console.log('Carrito después de populate:', cart.products.map(p => p.product ? p.product.title : 'null'));
        let total = 0;
        cart.products.forEach(item => {
            item.subtotal = item.product.price * item.quantity;
            total += item.subtotal;
        })
        res.render('cartDetail', { cart, total })
    } catch (error) {
        console.error('Mensaje:', error.message);
        if (error.message.includes('permiso')) {
            res.status(403).send('No tienes permiso para ver este carrito');
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    }
})

router.get('/login', async (req,res)=>{
    try{
        res.render('login',{
            title: 'Iniciar sesion'
        });
        
    }catch(error){
        console.error('Error al renderizar login:', error);
        res.status(500).send('Error al cargar la página de login');
    }
})
router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro de usuario' });
});




router.get('/test', (req, res) => {
    res.render('test');
});

export default router;