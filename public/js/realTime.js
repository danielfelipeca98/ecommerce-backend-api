document.addEventListener('DOMContentLoaded', () => {
    const socket = io();


    socket.on('update-products', (data) => {
        console.log('📦 DATA completa recibida:', data);
        const products = data || [];
        console.log('🟢 Productos extraídos:', products);
        const listContainer = document.getElementById('product-List');
        console.log('Contenedor:', listContainer);

        if (listContainer) {
            listContainer.innerHTML = products.map(p => `
            <li>
                <span style="font-size:0.8em; color:gray;">ID: ${p._id}</span><br>
                <strong>${p.title}</strong> - $${p.price}
                (${p.category}) Stock: ${p.stock} Código: ${p.code}
                
            </li>
            `).join('');
            console.log('Lista actualizada con', products.length, 'productos');
        } else {
            console.warn('Contenedor no encontrado');
        }
    });


    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value
        const description = document.getElementById('description').value
        const code = document.getElementById('code').value
        const price = parseInt(document.getElementById('price').value)
        const stock = parseInt(document.getElementById('stock').value)
        const category = document.getElementById('category').value

        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category
        };
        socket.emit('new-product', newProduct);
        e.target.reset();
    })

    document.getElementById('deleteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('deleteId').value.trim();
        console.log(' Enviando ID a eliminar:', id);///////////////////////////
        if (id) {
            socket.emit('delete-product', id)
        } else { alert('Id invalido') }
        e.target.reset();
    })
})

window.deleteProduct = function (id) {
    socket.emit('delete-product', id);
};


