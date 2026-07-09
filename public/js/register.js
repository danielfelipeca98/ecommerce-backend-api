const inputEmail = document.getElementById('email')
const inputPassword = document.getElementById('password')
const inputConfirmPassword = document.getElementById('confirmPassword')
const registerForm = document.getElementById('registerForm')
const errorDiv = document.getElementById('mensaje-error');


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;

    if (!email || !password || !confirmPassword) {
        mostrarError('Todos los espacios son obligatorios')
        return
    }
    if (!email.includes('@') || !email.includes('.')) {
        mostrarError('Ingresa un email válido (debe contener @ y un punto).');
        return;
    }

    if (password !== confirmPassword) {
        mostrarError('clave invalida: no coinciden')
        return
    }
    if (password.length < 6) {
        mostrarError('clave invalida: minimo 6 caracteres')
        return
    }
    const datos = { email, password }
    try {

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })

        const result = await response.json();

        if (response.ok) {
            console.log('Registro exitoso. Redirigiendo al login...');
            mostrarExito('¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 5000);
        } else {
            const mensajeError = result.error || 'Error al registrar el usuario.';
            mostrarError(mensajeError);
            inputPassword.value = '';
            inputConfirmPassword.value = '';
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('No se pudo conectar con el servidor. Intenta más tarde.');
    }

})

function mostrarError(mensaje) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    errorDiv.style.color = 'red';
}

function mostrarExito(mensaje) {
    console.log('mostrarExito llamado con mensaje:', mensaje);
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    errorDiv.style.color = 'green';
}