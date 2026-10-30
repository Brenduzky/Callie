// ===== CONFIGURACIÓN =====
const TIEMPO_TOTAL = 10; // segundos que dura cada imagen (cambialo si querés más o menos tiempo)

// Las 6 partes del juego.
// nombre: es lo que se ve en el cuadrito punteado mientras no haya imagen
// imagen: PEGÁ ACÁ EL LINK DE LA IMAGEN (ej: "../../imagenes/lengua.png")
const ejercicios = [
  { nombre: "Imagen 1", imagen: "" },
  { nombre: "Imagen 2", imagen: "" },
  { nombre: "Imagen 3", imagen: "" },
  { nombre: "Imagen 4", imagen: "" },
  { nombre: "Imagen 5", imagen: "" },
  { nombre: "Imagen 6", imagen: "" }
];

// ===== ELEMENTOS DEL HTML =====
const ejercicio = document.getElementById('ejercicio');
const flechaIntro = document.getElementById('flechaIntro');
const juego = document.getElementById('juego');
const mensaje = document.getElementById('mensaje');
const relleno = document.getElementById('relleno');
const espacioImagen = document.getElementById('espacioImagen');
const imagenEjercicio = document.getElementById('imagenEjercicio');
const botonPausa = document.getElementById('botonPausa');
const flechaSiguiente = document.getElementById('flechaSiguiente');
const jugarOtraVez = document.getElementById('jugarOtraVez');

// ===== VARIABLES DEL JUEGO =====
let indice = 0;        // en cuál de las 6 partes va (0 = la primera)
let transcurrido = 0;  // cuántos milisegundos de tiempo ya pasaron en esta parte
let ultimo = 0;        // el momento (en ms) de la última vez que se actualizó el reloj
let intervalo = null;  // guarda el "reloj" que se repite (null = el reloj está frenado)

// ===== CAMBIAR DE PANTALLA =====
function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

// Cambia el "estado" del juego: jugando / pausa / exito
// El CSS usa este estado para pintar la barra y el botón (naranja, azul o verde)
function cambiarEstado(estado) {
  juego.dataset.estado = estado;
  if (estado === 'exito') {
    mensaje.textContent = 'Muy Bien!!!';
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
  cambiarEstado('exito');               // barra verde, "Muy Bien!!!" y aparece la flecha
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

// ===== IMAGEN DEL EJERCICIO =====
// Si hay link se muestra la imagen; si no, queda el cuadrito punteado con el nombre
function ponerImagen(link, nombre) {
  espacioImagen.dataset.nombre = nombre;
  if (link) {
    imagenEjercicio.src = link;
    espacioImagen.classList.remove('sin-imagen');
  } else {
    imagenEjercicio.removeAttribute('src');
    espacioImagen.classList.add('sin-imagen');
  }
}

// ===== CARGAR LA PARTE ACTUAL =====
function cargarEjercicio() {
  const actual = ejercicios[indice];
  ponerImagen(actual.imagen, actual.nombre);

  detenerReloj();                       // por las dudas, se frena el reloj anterior
  transcurrido = 0;                     // el tiempo empieza de cero
  actualizarBarra();
  cambiarEstado('jugando');
  iniciarReloj();                       // el tiempo arranca solo
}

// ===== PASAR A LA PRÓXIMA PARTE =====
function siguiente() {
  indice++;
  if (indice >= ejercicios.length) {
    mostrarModo('modo-final');          // hizo las 6: pantalla de que ganó
  } else {
    cargarEjercicio();
  }
}

// ===== EMPEZAR EL JUEGO (sale de la intro) =====
function empezar() {
  indice = 0;
  mostrarModo('modo-juego');
  cargarEjercicio();
}

// ===== Q PASA SI SE TOCA CADA COSA =====
flechaIntro.addEventListener('click', empezar);
botonPausa.addEventListener('click', alternarPausa);
flechaSiguiente.addEventListener('click', siguiente);
jugarOtraVez.addEventListener('click', empezar);   // vuelve a empezar desde la parte 1

// ===== BOTÓN X Y POPUP DE SALIR =====
const cerrar = document.getElementById('cerrar');
const modalSalir = document.getElementById('modalSalir');
const seguirJugando = document.getElementById('seguirJugando');
const salirJuego = document.getElementById('salirJuego');

let pausadoPorPopup = false;   // para acordarse si el reloj lo frenó el popup de salir

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