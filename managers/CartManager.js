import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";

class CartManager {
    async createCart(userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const newCart = await Cart.create({ products: [], user: userId });
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async getCartById(id, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const cart = await Cart.findById(id).populate('products.product');
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para ver este carrito');
            }
            cart.products = cart.products.filter(item => item.product !== null);
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('permiso')) {
                throw error;
            }
            throw new Error(`Error al obtener carrito: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid, quantity = 1, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const existingProduct = await Product.findById(pid);
            if (!existingProduct) {
                throw new Error(`Producto con ID ${pid} no encontrado`);
            }
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid);
            if (oneProduct) {
                oneProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity: quantity });
            }
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async deleteProductFromCart(cid, pid, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró Carrito ${cid}`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid);
            if (!oneProduct) {
                throw new Error(`Producto ${pid} no encontrado en el carrito`);
            }
            cart.products = cart.products.filter(p => p.product.toString() !== pid);
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('permiso')) {
                throw error;
            }
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async clearCart(cid, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró Carrito ${cid}`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            cart.products = [];
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                throw error;
            }
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }

    async updateProduct(cid, pid, quantity, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró Carrito ${cid}`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid);
            if (!oneProduct) {
                throw new Error(`Producto ${pid} no encontrado en el carrito`);
            }
            if (quantity > 0) {
                oneProduct.quantity = quantity;
                await cart.save();
                await cart.populate('products.product');
                return cart;
            } else {
                // Si quantity <= 0, eliminar el producto
                return await this.deleteProductFromCart(cid, pid, userId);
            }
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('permiso')) {
                throw error;
            }
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async updateCart(cid, productsArray, userId) {
        try {
            if (!userId) throw new Error('Usuario no autenticado');
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`);
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            if (!Array.isArray(productsArray)) {
                throw new Error('El body debe ser un array de productos');
            }
            const productIds = productsArray.map(item => item.product);
            const existingProducts = await Product.find({ _id: { $in: productIds } });
            if (existingProducts.length !== productIds.length) {
                const foundIds = existingProducts.map(p => p._id.toString());
                const missingIds = productIds.filter(id => !foundIds.includes(id.toString()));
                throw new Error(`Los siguientes productos no existen: ${missingIds.join(', ')}`);
            }
            for (const item of productsArray) {
                if (!item.quantity || item.quantity <= 0) {
                    throw new Error(`La cantidad para el producto ${item.product} debe ser mayor a 0`);
                }
            }
            cart.products = productsArray;
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('no existen')) {
                throw error;
            }
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }
}

export default CartManager;