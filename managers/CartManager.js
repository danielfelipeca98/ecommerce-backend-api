const fs = require('fs').promises;

class CartManager {
    constructor() {
        this.carts = [];
        this.path = './data/carts.json';
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.carts = [];
                await fs.writeFile(this.path, '[]', 'utf8');
            } else {
                throw error;
            }
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(this.path, data, 'utf8');
    }

    async createCart() {
        await this.loadCarts();

        let newId = 1;
        if (this.carts.length > 0) {
            const ids = this.carts.map(c => c.id);
            newId = Math.max(...ids) + 1;
        }

        const newCart = {
            id: newId,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        await this.loadCarts();
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error(`Carrito con ID ${id} no encontrado`);
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        await this.loadCarts();
        const cart = await this.getCartById(cid);

        const existingProduct = cart.products.find(p => p.product === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;