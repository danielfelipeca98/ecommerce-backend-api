import express from 'express';
import CartManager from '../managers/CartManager.js'

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = req.body.quantity || 1;
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart((req.params.cid), (req.params.pid));
        res.json(cart)
    } catch (error) {
        if (error.message.includes('no encontrado') || error.message.includes('no existen')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.updateProduct(req.params.cid, req.params.pid, quantity);
        res.json(cart)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateCart(req.params.cid, req.body);
        res.json(cart)
    } catch (error) {
        if (error.message.includes('no encontrado') || error.message.includes('no existen')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);
        res.json(cart)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


export default router;