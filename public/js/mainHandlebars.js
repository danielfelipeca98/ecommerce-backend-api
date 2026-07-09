document.addEventListener('DOMContentLoaded', () => {
    const enlace = document.getElementById('verCarrito');
    const cid = localStorage.getItem('carritoId');

    if (cid) {
        enlace.href = `/carts/${cid}`;
        enlace.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    } else {
        enlace.href = '/';
        enlace.innerHTML = '<i class="fas fa-shopping-cart" style="color: var(--color-text-light);"></i>';
    }
    const btnLogout = document.getElementById('btnLogout');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (btnLogout) {
        if (token) {
            btnLogout.style.display = 'inline-block';
        } else {
            btnLogout.style.display = 'none';
        }
    }

    if (userData && btnLogout) {
    try {
        const user = JSON.parse(userData);
        const saludo = document.createElement('span');
        saludo.textContent = `Bienvenido/a, ${user.email}`;
        saludo.style.marginRight = '15px';
        saludo.style.fontWeight = '500';
        saludo.style.color = 'var(--color-text)';
        btnLogout.parentNode.insertBefore(saludo, btnLogout);
    } catch (e) {
        console.error('Error al mostrar usuario:', e);
    }
}
});


const linkProductos = document.getElementById('linkProductos');
const userData = localStorage.getItem('user');

if (linkProductos && userData) {
    try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
            linkProductos.style.display = 'none';
        }
    } catch (e) {
        console.error('Error al parsear usuario:', e);
    }
}