const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Inicio',
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
    
        const products = await productManager.getProducts();
        console.log('Productos enviados a la vista:', products);
        res.render('realTimeProducts', {
            title: 'Productos en tiempo real',
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar productos');
    }
});

module.exports = router;