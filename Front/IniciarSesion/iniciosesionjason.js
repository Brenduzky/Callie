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

    localStorage.setItem('usuario', JSON.stringify(datos.usuario));

    window.location.href = '../principal/pantalla-atras.html';

}

botonSiguiente.addEventListener('click', iniciarSesion);