document.addEventListener('DOMContentLoaded', () => {

    const botonesMore = document.querySelectorAll('.btn-more');
    const botonesLess = document.querySelectorAll('.btn-less');

    const actualizarCantidad = async (boton, incremento) => {
        const pid = boton.dataset.pid;
        const cid = boton.dataset.cid;
        const li = boton.closest('li');
        const cantidadSpan = li.querySelector('.cantidad');
        const subtotalSpan = li.querySelector('.subtotal');

        const precio = parseFloat(subtotalSpan?.dataset.precio);
        if (isNaN(precio)) {
            console.warn('Precio no válido, se usará 0');
            return;
        }

        if (!cantidadSpan || !subtotalSpan) {
            console.warn('Elementos no encontrados');
            return;
        }

        let cantidadActual = parseInt(cantidadSpan.textContent, 10);
        let nuevaCantidad = cantidadActual + incremento;

        if (nuevaCantidad < 0) return;

        if (nuevaCantidad === 0) {
            const confirmar = confirm('¿Eliminar este producto del carrito?');
            if (!confirmar) return;

            try {
                const respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: 0 })
                });

                if (respuesta.ok) {
                    li.remove();
                    actualizarTotal();
                } else {
                    const error = await respuesta.json();
                    alert(`Error: ${error.error || 'No se pudo eliminar'}`);
                }
            } catch (error) {
                alert('Error de conexión');
                console.error(error);
            }
            return;
        }

        const nuevoSubtotal = precio * nuevaCantidad;

        try {
            const respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: nuevaCantidad })
            });

            if (respuesta.ok) {
                cantidadSpan.textContent = nuevaCantidad;
                subtotalSpan.textContent = nuevoSubtotal.toFixed(2);
                actualizarTotal();
            } else {
                const error = await respuesta.json();
                alert(`Error: ${error.error || 'No se pudo actualizar'}`);
            }
        } catch (error) {
            alert('Error de conexión');
            console.error(error);
        }
    };

    const actualizarTotal = () => {
        const subtotales = document.querySelectorAll('.subtotal');
        let total = 0;
        subtotales.forEach(el => {
            total += parseFloat(el.textContent) || 0;
        });
        const totalSpan = document.getElementById('total-carrito');
        if (totalSpan) {
            totalSpan.textContent = total.toFixed(2);
        }
    };

    botonesMore.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            actualizarCantidad(e.currentTarget, 1);
        });
    });
    botonesLess.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            actualizarCantidad(e.currentTarget, -1);
        });
    });

    const btnPay = document.getElementById('btnPay');
    if (btnPay) {
        btnPay.addEventListener('click', async (e) => {
            e.preventDefault();
            const cid = btnPay.dataset.cid;
            if (!cid) {
                alert('No se encontró el ID del carrito');
                return;
            }
            const confirmar = confirm('¿Vaciar todo el carrito?');
            if (!confirmar) return;

            try {
                const respuesta = await fetch(`/api/carts/${cid}`, {
                    method: 'DELETE'
                });

                if (respuesta.ok) {
                    mostrarMensaje('Carrito vaciado correctamente', 'exito');
                    location.reload();
                    const lista = document.querySelector('ul');
                    if (lista) lista.innerHTML = '';
                    actualizarTotal(); // total a 0
                } else {
                    const error = await respuesta.json();
                    mostrarMensaje(`Error: ${error.error || 'No se pudo actualizar'}`, 'error');
                }
            } catch (error) {
                alert('Error de conexión');
                console.error(error);
            }
        });
    }

});