const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 4; // id de este juego en tu base de datos

function obtenerIdUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? usuario.id : null;
  } catch (error) {
    return null;
  }
}

let resultadoEnviado = false; // evita sumar los peces dos veces en la misma partida




// ===== CONFIGURACIÓN =====
const TIEMPO_TOTAL = 10; // segundos que dura cada ronda mientras copia la imagen (cambialo si querés)
const IMAGEN_RELOJ = "../../imagenes/Reloj.png";
// LAS 6 RONDAS.
// Cada ronda tiene 2 links:
//   normal:    la imagen que se repite (aparece 2 veces)
//   diferente: la imagen distinta (aparece 1 vez) -> es la que hay que tocar y después copiar
// PEGÁ ACÁ LOS LINKS (ej: "../../imagenes/lengua-afuera.png")
// Mientras estén vacíos se ven cuadritos punteados que dicen cuál es cuál.
const rondasBase = [
  { nombre: "Ronda 1", normal: "../../imagenes/nene-derecha.abajo.png", diferente: "../../imagenes/nene-izquierda.arriba.png" },
  { nombre: "Ronda 2", normal: "../../imagenes/nene-derecha.arriba.png", diferente: "../../imagenes/nene-medio.abajo.png" },
  { nombre: "Ronda 3", normal: "../../imagenes/nene-derecha.abajo.png", diferente: "../../imagenes/nene-medio.arriba.png" },
  { nombre: "Ronda 4", normal: "../../imagenes/nene-medio.abajo.png", diferente: "../../imagenes/nene-izquierda.arriba.png" },
  { nombre: "Ronda 5", normal: "../../imagenes/nene-derecha.arriba.png", diferente: "../../imagenes/nene-derecha.abajo.png" },
  { nombre: "Ronda 6", normal: "../../imagenes/nene-medio.arriba.png", diferente: "../../imagenes/nene-izquierda.abajo.png" }
];

// ===== ELEMENTOS DEL HTML =====
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

// ===== VARIABLES DEL JUEGO =====
let rondas = [];            // las 6 rondas, en el orden mezclado de ESTA partida
let posiciones = [];        // en qué lugar (0, 1 o 2) va la imagen diferente de cada ronda
let indice = 0;             // en cuál de las 6 rondas va (0 = la primera)
let posicionCorrecta = 0;   // lugar (0, 1 o 2) de la imagen diferente en la ronda actual
let rondaActual = null;     // la ronda que se está jugando (objeto de la lista)
let bloqueado = false;      // si es true, los clics en las imágenes se ignoran

let transcurrido = 0;       // cuántos milisegundos de tiempo ya pasaron en esta ronda
let ultimo = 0;             // el momento (en ms) de la última vez que se actualizó el reloj
let intervalo = null;       // guarda el "reloj" que se repite (null = el reloj está frenado)
let pausadoPorPopup = false; // para acordarse si el reloj lo frenó el popup de salir

// ===== MEZCLAR =====
// Misma función que en los otros juegos: saca elementos al azar de una copia
function mezclar(lista) {
  const restantes = [...lista];
  const resultado = [];
  while (restantes.length > 0) {
    const i = Math.floor(Math.random() * restantes.length);
    resultado.push(restantes.splice(i, 1)[0]);
  }
  return resultado;
}

// ===== PREPARAR UNA PARTIDA NUEVA =====
// Se llama cada vez que se empieza a jugar (y también en "Volver a jugar").
function prepararPartida() {
  // 1) las 6 rondas en un orden distinto cada vez
  rondas = mezclar(rondasBase);

  // 2) el lugar de la imagen diferente de cada ronda.
  //    [0,0,1,1,2,2] = la diferente cae 2 veces a la izquierda, 2 en el medio y 2 a la derecha,
  //    y se mezcla para que cada partida tenga un orden distinto (ej: 1 2 2 -> 2 2 1).
  //    Así nunca se repite el mismo lugar 6 veces seguidas.
  posiciones = mezclar([0, 0, 1, 1, 2, 2]);

  indice = 0;
}

// ===== CAMBIAR DE PANTALLA =====
function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

// Cambia el "estado" del juego: buscar / jugando / pausa / exito
// El CSS usa este estado para mostrar u ocultar cosas y para pintar la barra y el botón
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

// ===== EL RELOJ =====
// Cada 50 ms suma el tiempo que pasó y actualiza la barra.
// Como se guarda lo "transcurrido", al pausar y volver a tocar sigue desde donde se había quedado.
function iniciarReloj() {
  if (intervalo !== null) return;       // si ya está andando, no crea otro
  ultimo = performance.now();
  intervalo = setInterval(tick, 50);
}

function detenerReloj() {
  clearInterval(intervalo);
  intervalo = null;
}

function tick() {
  const ahora = performance.now();
  transcurrido += ahora - ultimo;       // suma lo que pasó desde la última vez
  ultimo = ahora;

  if (transcurrido >= TIEMPO_TOTAL * 1000) {
    terminarTiempo();                   // se acabó el tiempo
  } else {
    actualizarBarra();
  }
}

// La barra se llena de a poco: porcentaje = tiempo pasado / tiempo total
function actualizarBarra() {
  const porcentaje = (transcurrido / (TIEMPO_TOTAL * 1000)) * 100;
  relleno.style.width = porcentaje + '%';
}

function terminarTiempo() {
  detenerReloj();
  transcurrido = TIEMPO_TOTAL * 1000;
  actualizarBarra();                    // barra llena
  cambiarEstado('exito');               // barra verde, "Muy bien!!!" y aparece la flecha
}

// ===== BOTÓN DE PAUSA =====
// Si estaba jugando: congela el tiempo (todo azul). Si estaba en pausa: sigue el tiempo.
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

// ===== CARGAR UNA RONDA (parte 1: elegir la imagen diferente) =====
function cargarRonda() {
  rondaActual = rondas[indice];
  posicionCorrecta = posiciones[indice];
  bloqueado = false;

  detenerReloj();                       // por las dudas, se frena el reloj anterior
  transcurrido = 0;                     // el tiempo empieza de cero
  actualizarBarra();

  cambiarEstado('buscar');
  dibujarOpciones();
}

// Crea los 3 botones con imagen. La del lugar "posicionCorrecta" lleva la imagen diferente,
// las otras dos llevan la imagen normal.
function dibujarOpciones() {
  contenedorOpciones.innerHTML = '';    // borra lo de la ronda anterior

  for (let i = 0; i < 3; i++) {
    const esDiferente = (i === posicionCorrecta);
    const link = esDiferente ? rondaActual.diferente : rondaActual.normal;

    const boton = document.createElement('button');  // crea un <button> nuevo
    boton.className = 'opcion';                       // le pone la clase del CSS

    if (link) {
      // si hay link, se muestra la imagen
      const img = document.createElement('img');
      img.src = link;
      img.alt = 'Imagen ' + (i + 1);
      boton.appendChild(img);
    } else {
      // si todavía no hay link, se ve un cuadrito punteado que dice cuál es cuál
      boton.classList.add('sin-imagen');
      boton.dataset.nombre = rondaActual.nombre + (esDiferente ? ' (diferente)' : ' (igual)');
    }

    boton.addEventListener('click', () => elegirOpcion(i, boton)); // al tocarla
    contenedorOpciones.appendChild(boton);            // la mete adentro del contenedor
  }
}

// ===== LO QUE PASA AL TOCAR UNA IMAGEN =====
function elegirOpcion(i, boton) {
  if (bloqueado) return;                // si está bloqueado, no hace nada

  if (i === posicionCorrecta) {

    bloqueado = true;
    boton.classList.add('acierto');
    setTimeout(comenzarCopia, 600);
  } else {
    // ERRÓ: la imagen se sacude y puede seguir intentando
    boton.classList.remove('error');    // por si todavía tenía la clase de un intento anterior
    void boton.offsetWidth;             // truco para que la animación se pueda repetir
    boton.classList.add('error');
    mensaje.textContent = 'Esa no es, intenta de nuevo!';
  }
}

// ===== CARGAR UNA RONDA (parte 2: copiar la imagen hasta que se acabe el tiempo) =====
function comenzarCopia() {
  // muestra la imagen diferente (la que eligió) para que la copie
  espacioImagen.dataset.nombre = rondaActual.nombre;
  if (rondaActual.diferente) {
    imagenEjercicio.src = rondaActual.diferente;
    espacioImagen.classList.remove('sin-imagen');
  } else {
    imagenEjercicio.removeAttribute('src');
    espacioImagen.classList.add('sin-imagen');
  }

  transcurrido = 0;
  actualizarBarra();
  cambiarEstado('jugando');

  // si justo tenía abierto el popup de salir, el tiempo arranca recién cuando lo cierre
  if (modalSalir.classList.contains('visible')) {
    pausadoPorPopup = true;
  } else {
    iniciarReloj();                     // el tiempo arranca solo
  }
}

// ===== PASAR A LA PRÓXIMA RONDA =====
function siguiente() {
  indice++;
  if (indice >= rondas.length) {
    mostrarModo('modo-final');          // hizo las 6: pantalla de que ganó
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

  try {
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
      resultadoEnviado = false; // permite reintentar
      return;
    }

    // Muestra los peces ganados si existe el elemento en el HTML
    const pecesGanados = document.getElementById('pecesGanados');
    if (pecesGanados && datos.monedasGanadas !== undefined) {
      pecesGanados.textContent = datos.monedasGanadas;
    }
  } catch (error) {
    console.error('No se pudo enviar el resultado al servidor:', error);
    resultadoEnviado = false;
  }
}

// ===== EMPEZAR EL JUEGO (sale de la intro, y también "Volver a jugar") =====
function empezar() {
  resultadoEnviado = false;             // partida nueva: se puede volver a enviar
  prepararPartida();                    // mezcla todo de nuevo
  mostrarModo('modo-juego');
  cargarRonda();
}


// ===== IMAGEN DEL RELOJ =====
// Si hay link se muestra la imagen; si no, queda el cuadrito punteado
function ponerReloj() {
  if (IMAGEN_RELOJ) {
    imagenReloj.src = IMAGEN_RELOJ;
    reloj.classList.remove('sin-imagen');
  } else {
    imagenReloj.removeAttribute('src');
    reloj.classList.add('sin-imagen');
  }
}
ponerReloj();   // se hace una sola vez, al cargar la página

// ===== Q PASA SI SE TOCA CADA COSA =====
flechaIntro.addEventListener('click', empezar);
botonPausa.addEventListener('click', alternarPausa);
flechaSiguiente.addEventListener('click', siguiente);
jugarOtraVez.addEventListener('click', empezar);   // vuelve a empezar con todo mezclado

// ===== BOTÓN X Y POPUP DE SALIR =====
function salir() {
  window.location.href = '../principal/pantalla-atras.html';
}

cerrar.addEventListener('click', () => {
  if (ejercicio.classList.contains('modo-final')) {
    salir();                               // en la pantalla final se cierra de una
  } else {
    // mientras el popup está abierto el tiempo no corre
    if (intervalo !== null) {
      detenerReloj();
      pausadoPorPopup = true;
    }
    modalSalir.classList.add('visible');   // si no, pregunta primero
  }
});

seguirJugando.addEventListener('click', () => {
  modalSalir.classList.remove('visible');  // vuelve al juego
  if (pausadoPorPopup) {
    pausadoPorPopup = false;
    iniciarReloj();                        // el tiempo sigue donde estaba
  }
});
salirJuego.addEventListener('click', salir);