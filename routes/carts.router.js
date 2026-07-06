import express from 'express';
import CartManager from '../managers/CartManager.js'
import auth from '../middlewares/auth.middleware.js'

const router = express.Router();
const cartManager = new CartManager();

router.post('/', auth, async (req, res) => {
    try {
        const cart = await cartManager.createCart(req.user.id);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', auth, async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid, req.user.id);
        res.json(cart);
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.post('/:cid/product/:pid', auth, async (req, res) => {
    try {
        const quantity = req.body.quantity || 1;
        if (quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity, req.user.id);
        res.json(cart);
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
})

router.delete('/:cid/products/:pid', auth, async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart((req.params.cid), (req.params.pid), (req.user.id));
        res.json(cart)
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:cid/products/:pid', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.updateProduct(req.params.cid, req.params.pid, quantity, req.user.id);
        res.json(cart)
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
})


router.put('/:cid', auth, async (req, res) => {
    try {
        const cart = await cartManager.updateCart(req.params.cid, req.body, req.user.id);
        res.json(cart)
    } catch (error) {
    if (error.message.includes('no encontrado') || error.message.includes('no existen')) {
        res.status(404).json({ error: error.message });
    } else if (error.message.includes('permiso')) {
        res.status(403).json({ error: error.message });
    } else {
        res.status(500).json({ error: error.message });
    }
}
});

router.delete('/:cid', auth, async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid, req.user.id);
        res.json(cart)
    } catch (error) {
    if (error.message.includes('no encontrado')) {
        res.status(404).json({ error: error.message });
    } else if (error.message.includes('permiso')) {
        res.status(403).json({ error: error.message });
    } else {
        res.status(500).json({ error: error.message });
    }
}
});


export default router;