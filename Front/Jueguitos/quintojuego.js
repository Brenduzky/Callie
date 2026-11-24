const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 5;

function obtenerIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario ? usuario.id : null;
}

let resultadoEnviado = false;

const TIEMPO_TOTAL = 10;
const IMAGEN_RELOJ = "../../imagenes/Reloj.png";
const ejercicios = [
  { imagen: "../../imagenes/nene-medio.abajo.png" },
  { imagen: "../../imagenes/nene-medio.arriba.png" },
  { imagen: "../../imagenes/nene-derecha.arriba.png" },
  { imagen: "../../imagenes/nene-izquierda.arriba.png" },
  { imagen: "../../imagenes/nene-izquierda.abajo.png" },
  { imagen: "../../imagenes/nene-derecha.arriba.png" }
];

const ejercicio = document.getElementById('ejercicio');
const flechaIntro = document.getElementById('flechaIntro');
const juego = document.getElementById('juego');
const mensaje = document.getElementById('mensaje');
const reloj = document.getElementById('reloj');
const imagenReloj = document.getElementById('imagenReloj');
const relleno = document.getElementById('relleno');
const espacioImagen = document.getElementById('espacioImagen');
const imagenEjercicio = document.getElementById('imagenEjercicio');
const botonPausa = document.getElementById('botonPausa');
const flechaSiguiente = document.getElementById('flechaSiguiente');
const jugarOtraVez = document.getElementById('jugarOtraVez');

let indice = 0;
let transcurrido = 0;
let ultimo = 0;
let intervalo = null;

function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

function cambiarEstado(estado) {
  juego.dataset.estado = estado;
  if (estado === 'exito') {
    mensaje.textContent = 'Muy Bien!!!';
  } else {
    mensaje.textContent = 'Copia la imagen que aparezca y mantenlo hasta que se acabe el tiempo!';
  }
}

function iniciarReloj() {
  if (intervalo !== null) return;
  ultimo = performance.now();
  intervalo = setInterval(tick, 50);
}

function detenerReloj() {
  clearInterval(intervalo);
  intervalo = null;
}

function tick() {
  const ahora = performance.now();
  transcurrido += ahora - ultimo;
  ultimo = ahora;

  if (transcurrido >= TIEMPO_TOTAL * 1000) {
    terminarTiempo();
  } else {
    actualizarBarra();
  }
}

function actualizarBarra() {
  const porcentaje = (transcurrido / (TIEMPO_TOTAL * 1000)) * 100;
  relleno.style.width = porcentaje + '%';
}

function terminarTiempo() {
  detenerReloj();
  transcurrido = TIEMPO_TOTAL * 1000;
  actualizarBarra();
  cambiarEstado('exito');
}

function alternarPausa() {
  const estado = juego.dataset.estado;
  if (estado === 'jugando') {
    detenerReloj();
    cambiarEstado('pausa');
  } else if (estado === 'pausa') {
    cambiarEstado('jugando');
    iniciarReloj();
  }
}

function ponerImagen(link) {
  imagenEjercicio.src = link;
  espacioImagen.classList.remove('sin-imagen');
}

function cargarEjercicio() {
  ponerImagen(ejercicios[indice].imagen);

  detenerReloj();
  transcurrido = 0;
  actualizarBarra();
  cambiarEstado('jugando');
  iniciarReloj();
}

function siguiente() {
  indice++;
  if (indice >= ejercicios.length) {
    mostrarModo('modo-final');
    enviarResultado();
  } else {
    cargarEjercicio();
  }
}

async function enviarResultado() {
  if (resultadoEnviado) return;
  resultadoEnviado = true;

  const idUsuario = obtenerIdUsuario();
  if (idUsuario === null || idUsuario === undefined) {
    window.location.href = '../IniciarSesion/Iniciosesion.html';
    return;
  }

  const respuesta = await fetch(`${URL_SERVER}/ejercicios/completar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idUsuario: idUsuario,
      idEjercicio: ID_EJERCICIO,
      gano: true
    })
  });

  const datos = await respuesta.json();

  if (!datos.funciono) {
    console.error(datos.mensaje);
    resultadoEnviado = false;
    return;
  }

  const pecesGanados = document.getElementById('pecesGanados');
  if (pecesGanados && datos.monedasGanadas !== undefined) {
    pecesGanados.textContent = datos.monedasGanadas;
  }
}

function empezar() {
  resultadoEnviado = false;
  indice = 0;
  mostrarModo('modo-juego');
  cargarEjercicio();
}

imagenReloj.src = IMAGEN_RELOJ;
reloj.classList.remove('sin-imagen');

flechaIntro.addEventListener('click', empezar);
botonPausa.addEventListener('click', alternarPausa);
flechaSiguiente.addEventListener('click', siguiente);
jugarOtraVez.addEventListener('click', empezar);

const cerrar = document.getElementById('cerrar');
const modalSalir = document.getElementById('modalSalir');
const seguirJugando = document.getElementById('seguirJugando');
const salirJuego = document.getElementById('salirJuego');

let pausadoPorPopup = false;

function salir() {
  window.location.href = '../principal/pantalla-atras.html';
}

cerrar.addEventListener('click', () => {
  if (ejercicio.classList.contains('modo-final')) {
    salir();
  } else {
    if (intervalo !== null) {
      detenerReloj();
      pausadoPorPopup = true;
    }
    modalSalir.classList.add('visible');
  }
});

seguirJugando.addEventListener('click', () => {
  modalSalir.classList.remove('visible');
  if (pausadoPorPopup) {
    pausadoPorPopup = false;
    iniciarReloj();
  }
});
salirJuego.addEventListener('click', salir);