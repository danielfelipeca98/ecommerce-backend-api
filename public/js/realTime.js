document.addEventListener('DOMContentLoaded', () => {
    const socket = io();


    socket.on('update-products', (products) => {
        const productList = document.getElementById('productList');

        if (products.length === 0) {
            productList.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        let html = '<ul>';
        products.forEach(p => {
            html += `
            <li>
                <span style="font-size:0.8em; color:gray;">ID: ${p.id}</span>
                <strong>${p.title}</strong> - $${p.price}
                (${p.category}) - Stock: ${p.stock} - Código: ${p.code}
   
    
            </li>
        `;
        });
        html += '</ul>';

        productList.innerHTML = html;
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
        const id = parseInt(document.getElementById('deleteId').value)
        if (id > 0) {
            socket.emit('delete-product', id)
        } else { alert('Id invalido') }
        e.target.reset();
    })
})


