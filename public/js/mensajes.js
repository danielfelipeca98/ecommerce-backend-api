// ============================================
//  SISTEMA DE MENSAJES FLOTANTES (con clases CSS)
// ============================================

function mostrarMensaje(texto, tipo = 'exito') {
    let contenedor = document.getElementById('mensajes-flotantes');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'mensajes-flotantes';
        document.body.appendChild(contenedor);
    }

    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-flotante mensaje-${tipo}`;
    mensaje.textContent = texto;

    contenedor.appendChild(mensaje);

    requestAnimationFrame(() => {
        mensaje.classList.add('mostrar');
    });

    setTimeout(() => {
        mensaje.classList.remove('mostrar');
        mensaje.classList.add('ocultar');
        setTimeout(() => {
            mensaje.remove();
        }, 400);
    }, 3000);
}