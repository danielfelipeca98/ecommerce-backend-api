import express from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page);
        const sort = req.query.sort || null;
        const query = req.query.query || null;

        const result = await productManager.getProducts(limit, page, sort, query);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`

        const params = new URLSearchParams();
        if (limit) params.set('limit', limit);
        if (sort) params.set('sort', sort);
        if (query) params.set('query', query);

        result.prevLink = result.hasPrevPage
            ? `${baseUrl}?${params.toString()}&page=${result.prevPage}`
            : null;

        result.nextLink = result.hasNextPage
            ? `${baseUrl}?${params.toString()}&page=${result.nextPage}`
            : null;

        res.json(result);

    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const product = await productManager.updateProduct(req.params.pid, req.body);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;