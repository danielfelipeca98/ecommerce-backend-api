document.addEventListener('DOMContentLoaded',()=>{
    const btnLogout = document.getElementById('btnLogout');

    if(btnLogout){
        btnLogout.addEventListener('click',(e)=>{
            e.preventDefault();

            if(confirm('¿Estas seguro de que quieres cerrar sesion?')){
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('carritoId');
                window.location.href = '/login'
            }
        })
    }
})