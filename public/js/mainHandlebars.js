document.addEventListener('DOMContentLoaded',()=>{
    const enlace = document.getElementById('verCarrito');
    const cid = localStorage.getItem('carritoId');
    
    if (cid) {
        enlace.href = `/carts/${cid}`;
        enlace.textContent = 'Ver Carrito'; 
    } else {
        enlace.href = '/';
        enlace.textContent = 'Carrito vacío';
}
})