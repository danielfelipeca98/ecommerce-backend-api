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
});