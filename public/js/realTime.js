
const socket = io({
    auth: {
        token: localStorage.getItem('token')}
    });


window.deleteProduct = function (id) {
    if (confirm(`¿Eliminar producto ${id}?`)) {
        console.log('Eliminando producto:', id);
        socket.emit('delete-product', id);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    socket.on('update-products', (data) => {
        console.log('Productos recibidos:', data);
        const products = data || [];
        const listContainer = document.getElementById('product-List');

        if (listContainer) {
            listContainer.innerHTML = products.map(p => `
                <li>
                    <span style="font-size:0.8em; color:gray;">ID: ${p._id}</span><br>
                    <strong>${p.title}</strong> - $${p.price}
                    (${p.category}) - Stock: ${p.stock} - Código: ${p.code}
                    <button onclick="deleteProduct('${p._id}')" style="margin-left:10px; background-color:#dc3545; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
                        Eliminar
                    </button>
                </li>
            `).join('');
            console.log('Lista actualizada con', products.length, 'productos');
        } else {
            console.warn('Contenedor #product-List no encontrado');
        }
    });

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const code = document.getElementById('code').value;
        const price = parseInt(document.getElementById('price').value);
        const stock = parseInt(document.getElementById('stock').value);
        const category = document.getElementById('category').value;

        const newProduct = { title, description, code, price, stock, category };
        socket.emit('new-product', newProduct);
        e.target.reset();
        mostrarMensaje('Producto agregado correctamente', 'exito');
    });

    document.getElementById('deleteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('deleteId').value.trim();
        if (id) {
            socket.emit('delete-product', id);
            document.getElementById('deleteId').value = '';
        } else {
            mostrarMensaje('Ingresa un ID válido', 'error');
        }
    });

    socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket');
    });

    socket.on('disconnect', () => {
        console.warn('Desconectado del servidor');
    });

    socket.on('error-message', (data) => {
        mostrarMensaje(`${data.message}`, 'error');
    });
});