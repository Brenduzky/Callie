const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 6;

function obtenerIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario ? usuario.id : null;
}

let resultadoEnviado = false;

const TIEMPO_TOTAL = 10;
const IMAGEN_RELOJ = "../../imagenes/Reloj.png";

const rondasBase = [
  { nombre: "Ronda 1", normal: "../../imagenes/nene-derecha.abajo.png", diferente: "../../imagenes/nene-izquierda.arriba.png" },
  { nombre: "Ronda 2", normal: "../../imagenes/nene-derecha.arriba.png", diferente: "../../imagenes/nene-medio.abajo.png" },
  { nombre: "Ronda 3", normal: "../../imagenes/nene-derecha.abajo.png", diferente: "../../imagenes/nene-medio.arriba.png" },
  { nombre: "Ronda 4", normal: "../../imagenes/nene-medio.abajo.png", diferente: "../../imagenes/nene-izquierda.arriba.png" },
  { nombre: "Ronda 5", normal: "../../imagenes/nene-derecha.arriba.png", diferente: "../../imagenes/nene-derecha.abajo.png" },
  { nombre: "Ronda 6", normal: "../../imagenes/nene-medio.arriba.png", diferente: "../../imagenes/nene-izquierda.abajo.png" }
];

const ejercicio = document.getElementById('ejercicio');
const flechaIntro = document.getElementById('flechaIntro');
const juego = document.getElementById('juego');
const mensaje = document.getElementById('mensaje');
const contenedorOpciones = document.getElementById('opciones');
const reloj = document.getElementById('reloj');
const imagenReloj = document.getElementById('imagenReloj');
const relleno = document.getElementById('relleno');
const espacioImagen = document.getElementById('espacioImagen');
const imagenEjercicio = document.getElementById('imagenEjercicio');
const botonPausa = document.getElementById('botonPausa');
const flechaSiguiente = document.getElementById('flechaSiguiente');
const jugarOtraVez = document.getElementById('jugarOtraVez');

const cerrar = document.getElementById('cerrar');
const modalSalir = document.getElementById('modalSalir');
const seguirJugando = document.getElementById('seguirJugando');
const salirJuego = document.getElementById('salirJuego');

let rondas = [];
let posiciones = [];
let indice = 0;
let posicionCorrecta = 0;
let rondaActual = null;
let bloqueado = false;

let transcurrido = 0;
let ultimo = 0;
let intervalo = null;
let pausadoPorPopup = false;

function mezclar(lista) {
  const restantes = [...lista];
  const resultado = [];
  while (restantes.length > 0) {
    const i = Math.floor(Math.random() * restantes.length);
    resultado.push(restantes.splice(i, 1)[0]);
  }
  return resultado;
}

function prepararPartida() {
  rondas = mezclar(rondasBase);
  posiciones = mezclar([0, 0, 1, 1, 2, 2]);
  indice = 0;
}

function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

function cambiarEstado(estado) {
  juego.dataset.estado = estado;
  if (estado === 'buscar') {
    mensaje.textContent = 'Encuentra la imagen diferente!';
  } else if (estado === 'exito') {
    mensaje.textContent = 'Muy bien!!!';
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

function cargarRonda() {
  rondaActual = rondas[indice];
  posicionCorrecta = posiciones[indice];
  bloqueado = false;

  detenerReloj();
  transcurrido = 0;
  actualizarBarra();

  cambiarEstado('buscar');
  dibujarOpciones();
}

function dibujarOpciones() {
  contenedorOpciones.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const esDiferente = (i === posicionCorrecta);
    const link = esDiferente ? rondaActual.diferente : rondaActual.normal;

    const boton = document.createElement('button');
    boton.className = 'opcion';

    const img = document.createElement('img');
    img.src = link;
    img.alt = 'Imagen ' + (i + 1);
    boton.appendChild(img);

    boton.addEventListener('click', () => elegirOpcion(i, boton));
    contenedorOpciones.appendChild(boton);
  }
}

function elegirOpcion(i, boton) {
  if (bloqueado) return;

  if (i === posicionCorrecta) {
    bloqueado = true;
    boton.classList.add('acierto');
    setTimeout(comenzarCopia, 600);
  } else {
    boton.classList.remove('error');
    void boton.offsetWidth;
    boton.classList.add('error');
    mensaje.textContent = 'Esa no es, intenta de nuevo!';
  }
}

function comenzarCopia() {
  espacioImagen.dataset.nombre = rondaActual.nombre;
  imagenEjercicio.src = rondaActual.diferente;
  espacioImagen.classList.remove('sin-imagen');

  transcurrido = 0;
  actualizarBarra();
  cambiarEstado('jugando');

  if (modalSalir.classList.contains('visible')) {
    pausadoPorPopup = true;
  } else {
    iniciarReloj();
  }
}

function siguiente() {
  indice++;
  if (indice >= rondas.length) {
    mostrarModo('modo-final');
    enviarResultado();
  } else {
    cargarRonda();
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
  prepararPartida();
  mostrarModo('modo-juego');
  cargarRonda();
}

function ponerReloj() {
  imagenReloj.src = IMAGEN_RELOJ;
  reloj.classList.remove('sin-imagen');
}
ponerReloj();

flechaIntro.addEventListener('click', empezar);
botonPausa.addEventListener('click', alternarPausa);
flechaSiguiente.addEventListener('click', siguiente);
jugarOtraVez.addEventListener('click', empezar);

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