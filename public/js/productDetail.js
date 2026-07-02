async function obtenerOCrearCarrito() {

    let cid = localStorage.getItem('carritoId');

    if (cid) {
        try {
            const respuesta = await fetch(`/api/carts/${cid}`);
            if (respuesta.ok) {
                return cid;
            } else {
                localStorage.removeItem('carritoId');
            }
        } catch (error) {
            console.warn('Error al verificar carrito:', error);
        }
    }

    try {
        const respuesta = await fetch('/api/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo crear el carrito');
        }

        const data = await respuesta.json();
        cid = data._id;
        localStorage.setItem('carritoId', cid);
        console.log('Carrito creado:', cid);
        return cid;
    } catch (error) {
        console.error('Error al crear carrito:', error);
        alert('No se pudo inicializar el carrito. Intenta recargar la página.');
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btnAddProduct');
    const botonInc = document.getElementById('btnInc');
    const botonDec = document.getElementById('btnDec');
    const cantidadDisplay = document.getElementById('cantidadDisplay');

    if (!boton || !botonInc || !botonDec || !cantidadDisplay) {
        console.warn('Faltan elementos en la página (btnAddProduct, btnInc, btnDec, cantidadDisplay');
        return;
    }
    botonInc.addEventListener('click', (e) => {
        e.preventDefault();
        let cantidadActual = parseInt(cantidadDisplay.textContent, 10);
        cantidadActual += 1;
        cantidadDisplay.textContent = cantidadActual;
    });

    botonDec.addEventListener('click', (e) => {
        e.preventDefault();
        let cantidadActual = parseInt(cantidadDisplay.textContent, 10);
        if (cantidadActual > 1) {
            cantidadActual -= 1;
            cantidadDisplay.textContent = cantidadActual;
        }
    });



    boton.addEventListener('click', async (e) => {
        e.preventDefault();

        const pid = boton.dataset.id;
        if (!pid) {
            alert('Error: ID del producto no encontrado');
            return;
        }

        const cantidad = parseInt(cantidadDisplay.textContent, 10);
        if (cantidad < 1) {
            alert('La cantidad debe ser al menos 1');
            return;
        }


        try {
            const cid = await obtenerOCrearCarrito();


            const respuesta = await fetch(`/api/carts/${cid}/product/${pid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: cantidad })
            });

            if (respuesta.ok) {
                mostrarMensaje(`${cantidad} unidad(es) agregada(s) al carrito`, 'exito');
                window.location.href = `/carts/${cid}`;
            } else {
                const error = await respuesta.json();
                mostrarMensaje('Error: ID del producto no encontrado', 'error');
            }
        } catch (error) {
            alert('Error de conexión con el servidor');
            console.error(error);
        }
    });
});