import { fetchWithAuth } from './fetchWithAuth.js'

document.addEventListener('DOMContentLoaded', () => {

    async function obtenerOCrearCarrito() {
        let cid = localStorage.getItem('carritoId');
        if (cid) {
            try {
                const resp = await fetchWithAuth(`/api/carts/${cid}`);
                if (resp.ok) return cid;
                else localStorage.removeItem('carritoId');
            } catch (e) {
                console.warn('Error al verificar carrito:', e);
            }
        }
        const resp = await fetchWithAuth('/api/carts', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data = await resp.json();
        cid = data._id;
        localStorage.setItem('carritoId', cid);
        return cid;
    }

    const botonesInc = document.querySelectorAll('.btn-inc');
    const botonesDec = document.querySelectorAll('.btn-dec');

    botonesInc.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const li = boton.closest('li');
            const span = li.querySelector('.cantidad');
            let cantidad = parseInt(span.textContent, 10);
            cantidad += 1;
            span.textContent = cantidad;
        });
    });

    botonesDec.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const li = boton.closest('li');
            const span = li.querySelector('.cantidad');
            let cantidad = parseInt(span.textContent, 10);
            if (cantidad > 1) {
                cantidad -= 1;
                span.textContent = cantidad;
            }
        });
    });


    const botones = document.querySelectorAll('.btn-add-cart');

    botones.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            e.preventDefault();

            const pid = boton.dataset.pid;
            if (!pid) {
                alert('Error: ID del producto no encontrado');
                return;
            }

            const li = boton.closest('li');
            const span = li.querySelector('.cantidad');
            const cantidad = parseInt(span.textContent, 10);

            if (cantidad < 1) {
                alert('La cantidad debe ser al menos 1');
                return;
            }

            try {
                const cid = await obtenerOCrearCarrito();

                const respuesta = await fetchWithAuth(`/api/carts/${cid}/product/${pid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: cantidad })
                });

                if (respuesta.ok) {
                    mostrarMensaje(`${cantidad} unidad(es) agregada(s) al carrito`, 'exito');
                    window.location.href = `/carts/${cid}`;
                } else {
                    const error = await respuesta.json();
                    mostrarMensaje(`Error: ${error.error || 'No se pudo agregar'}`, 'error');
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
                console.error(error);
            }
        });
    });
});