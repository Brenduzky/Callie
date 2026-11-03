const URL_SERVER = 'http://localhost:3000';

const inputNombre = document.getElementById('nombre');
const inputContrasena = document.getElementById('contrasena');
const botonSiguiente = document.getElementById('siguiente');
const mensaje = document.getElementById('mensaje');

async function iniciarSesion(evento) {
  evento.preventDefault();
  mensaje.textContent = '';

  const nombre = inputNombre.value.trim();
  const contrasena = inputContrasena.value;

  if (nombre === '' || contrasena === '') {
    mensaje.textContent = 'Completá usuario y contraseña';
    return;
  }

  try {
    const respuesta = await fetch(`${URL_SERVER}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, contrasena })
    });

    const datos = await respuesta.json();

    if (!datos.funciono) {
      mensaje.textContent = datos.mensaje;
      return;
    }

    // Guardamos el usuario para usarlo en las otras pantallas
    localStorage.setItem('usuario', JSON.stringify(datos.usuario));

    window.location.href = '../principal/pantalla-atras.html';
  } catch (error) {
    mensaje.textContent = 'No se pudo conectar con el servidor';
    console.error(error);
  }
}

botonSiguiente.addEventListener('click', iniciarSesion);