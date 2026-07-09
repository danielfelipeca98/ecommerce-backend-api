const formLogin = document.getElementById('loginForm');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const errorDiv = document.getElementById('mensaje-error');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorDiv.textContent = '';
    errorDiv.style.display = 'none';

    const email = inputEmail.value.trim()
    const password = inputPassword.value.trim()

    if (!email || !password) {
        mostrarError('Porfavor ,Completa todos los campos')
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        mostrarError('Ingresa un email válido (debe contener @ y un punto).');
        return;
    }

    const datos = { email, password };
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const text = await response.text();
    let result;
    try {
        result = JSON.parse(text);
    } catch (e) {
        result = { error: text || 'Error desconocido del servidor' };
    }

        if (response.ok) {
            localStorage.setItem('token', result.tkn)
            localStorage.setItem('user', JSON.stringify(result.user));
            let cid = localStorage.getItem('carritoId')
            let carritoValido = false;
            if (cid) {
                try {
                    const verificyRes = await fetch(`/api/carts/${cid}`, {
                        headers: {
                            'authorization': `bearer ${result.tkn}`
                        }
                    });
                    if (verificyRes.ok) {
                        carritoValido = true;
                        console.log('Carrito existente es valido:', cid);
                    } else {
                        console.warn('Carrito no valido,eliminando..');
                        localStorage.removeItem('carritoId');
                        cid = null;
                        carritoValido = false;
                    }

                }catch (error) {
                    console.error('Error al verificar carrito', error);
                    localStorage.removeItem('carritoId');
                    cid = null;
                    carritoValido = false;
                }
            }

            if (!carritoValido) {
                try {
                    console.log('Creando nuevo carrito para el usuario...');
                    const crearRes = await fetch('/api/carts', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${result.tkn}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (crearRes.ok) {
                        const nuevoCarrito = await crearRes.json();
                        const nuevoCid = nuevoCarrito._id;
                        localStorage.setItem('carritoId', nuevoCid);
                        console.log('Nuevo carrito creado:', nuevoCid);
                    } else {
                        const errorData = await crearRes.json();
                        mostrarError(`Error al crear carrito: ${errorData.error || 'Intenta de nuevo'}`);
                        return; 
                   }
                } catch (error) {
                    console.error('Error al crear carrito:', error);
                    mostrarError('No se pudo crear el carrito. Intenta de nuevo.');
                    return;
                }
            }

        console.log('Login exitoso. Redirigiendo...');

        window.location.href = '/';
    }else {
            const mensajeError = result.error || 'Credenciales incorrectas.';
            mostrarError(mensajeError);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('No se pudo conectar con el servidor. Intenta más tarde.');
    }
});

function mostrarError(mensaje) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
    }