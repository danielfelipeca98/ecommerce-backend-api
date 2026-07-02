// ============================================
//  SISTEMA DE MENSAJES FLOTANTES (con clases CSS)
// ============================================

function mostrarMensaje(texto, tipo = 'exito') {
    // 1. Buscar o crear el contenedor
    let contenedor = document.getElementById('mensajes-flotantes');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'mensajes-flotantes';
        document.body.appendChild(contenedor);
    }

    // 2. Crear el mensaje
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje-flotante mensaje-${tipo}`;
    mensaje.textContent = texto;

    contenedor.appendChild(mensaje);

    // 3. Mostrar con animación (usando clases)
    requestAnimationFrame(() => {
        mensaje.classList.add('mostrar');
    });

    // 4. Eliminar después de 3 segundos
    setTimeout(() => {
        mensaje.classList.remove('mostrar');
        mensaje.classList.add('ocultar');
        setTimeout(() => {
            mensaje.remove();
        }, 400);
    }, 3000);
}