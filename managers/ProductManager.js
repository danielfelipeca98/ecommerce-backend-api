import Product from "../models/products.model.js";

class ProductManager {

    async getProducts(limit = 10, page = 1, sort = null, query = null) {
        console.log('getProducts llamado con:', { limit, page, sort, query });
        try {

            let filter = {};
            if (query) {
                const [key, value] = query.split(':');
                if (key && value) {
                    filter[key] = value;
                }
            }

            let sortOption = {};
            if (sort === 'asc') {
                sortOption = { price: 1 };
            } else if (sort === 'desc') {
                sortOption = { price: -1 };
            }

            const skip = limit === 0 ? 0 : (page - 1) * limit;

            const total = await Product.countDocuments(filter);

            const products = await Product.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit === 0 ? null : parseInt(limit));
            console.log('🔍 Productos encontrados en DB:', products.length);


            const totalPages = Math.ceil(total / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: parseInt(page),
                hasPrevPage,
                hasNextPage,

                prevLink: null,
                nextLink: null
            };

        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findOne({_id:id}).lean();
            if (!product) {
                throw new Error(`Producto ID:${id} no encontrado`)
            }
            return product
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('no existen')) {
                throw error;
            }
            throw new Error(`Error al encontrar producto: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = await Product.create(productData);
            console.log('✅ Producto creado en DB:', newProduct);
            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar el Producto: ${error.message}`);
        }

    }

    async updateProduct(id, fields) {
        try {
            const product = await Product.findByIdAndUpdate(id, fields, { new: true })
            if (!product) {
                throw new Error(`Producto con ID:${id} no encontrado`)
            }
            return product
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                throw error;
            }
            throw new Error(`Error al encontrar producto: ${error.message}`);
        }

    }

    async deleteProduct(id) {
        try {
            console.log('🗑️ Intentando eliminar producto con ID:', id);/////////////
            const product = await Product.findByIdAndDelete(id)
            console.log('🗑️ Resultado de eliminación:', product);
            if (!product) {
                throw new Error(`Producto con ID:${id} no encontrado`)
            }
            return product
        } catch (error) {
             console.error('❌ Error en deleteProduct:', error);
            if (error.message.includes('no encontrado')) {
                throw error;
            }
            throw new Error(`Error al encontrar producto: ${error.message}`);
        }
    }
}

export default ProductManager;