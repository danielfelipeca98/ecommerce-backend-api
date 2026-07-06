import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";


class CartManager {
    async createCart(userId) {
        try {
            const newCart = await Cart.create({ products: [], user: userId });
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async getCartById(id, userId) {
        try {
            const cart = await Cart.findById(id).populate('products.product');
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
            if (cart.user.toString() === userId) {
            } else {
                throw new Error('No tienes permiso para ver este carrito')
            }
            cart.products = cart.products.filter(item => item.product !== null);
            return cart
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('permiso')) {
                throw error;
            }
        }
    }

    async addProductToCart(cid, pid, quantity = 1, userId) {
        try {
            const existingProduct = await Product.findById(pid);
            if (!existingProduct) {
                throw new Error(`Producto con ID ${pid} no encontrado`)
            }
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado`)
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid);
            if (oneProduct) {
                oneProduct.quantity += quantity;
            }
            else { cart.products.push({ product: pid, quantity: quantity }) }
            await cart.save();
            await cart.populate('products.product');
            return cart;
        }
        catch (error) {
            throw new Error(`Error al buscar el producto: ${error.message}`);
        }
    }

    async deleteProductFromCart(cid, pid, userId) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontro Carrito ${cid}`)
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid)
            if (oneProduct) {
                cart.products = cart.products.filter(p => p.product.toString() !== pid)
                await cart.save();
                await cart.populate('products.product')
                return cart;
            }
            else {
                throw new Error(`Producto ${pid} no encontrado`);
            }
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('permiso')) {
                throw error;
            }
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async clearCart(cid,userId) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontro Carrito ${cid}`)
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            cart.products = [];
            await cart.save()
            await cart.populate('products.product')
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                throw new Error;
            }
            throw new Error(`Carrito no se pudo limpiar, ${error.message}`)
        }
    }

    async updateProduct(cid, pid, quantity,userId) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error(`No se encontro Carrito ${cid}`)
            }
            if (cart.user.toString() !== userId.toString()) {
                throw new Error('No tienes permiso para modificar este carrito');
            }
            const oneProduct = cart.products.find(p => p.product.toString() === pid)
            if (!oneProduct) {
                throw new Error(`Producto ${pid} no encontrado en el carrito`)
            } else {
                if (quantity > 0) {
                    oneProduct.quantity = quantity
                } else {
                    return await this.deleteProductFromCart(cid, pid)
                }
            }
            await cart.save();
            await cart.populate('products.product')
            return cart;
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                throw error;
            }
            throw new Error(`Carrito no se pudo limpiar, ${error.message}`)
        }
    }

    async updateCart(cid, productsArray,userId) {
        try {
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