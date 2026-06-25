const fs = require('fs').promises;

class ProductManager {
    constructor() {
        this.products = [];
        this.path = './data/products.json';
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.products = [];
                await fs.writeFile(this.path, '[]', 'utf8');
            } else {
                throw error;
            }
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data, 'utf8');
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }

    async addProduct(productData) {
        await this.loadProducts();

        let newId = 1;
        if (this.products.length > 0) {
            const ids = this.products.map(p => p.id);
            newId = Math.max(...ids) + 1;
        }

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description || '',
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, fields) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        delete fields.id;

        this.products[index] = {
            ...this.products[index],
            ...fields
        };

        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        this.products.splice(index, 1);
        await this.saveProducts();
        return true;
    }
}

module.exports = ProductManager;