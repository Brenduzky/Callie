//Los colores de los pares predeterminados
const pares = [
  { color: "#B7383A", fondo: "#F6A7A8", texto: "Di Ratón!!", emoji: "../../imagenes/carta-roja.png", dice:"six seven aura o laura esres tu" },
  { color: "#E2863C", fondo: "#FEC08E", texto: "Di Pelota!!", emoji: "../../imagenes/carta-naranja.png", dice:"pelota" },
  { color: "#2AA418", fondo: "#B0E995", texto: "Di Sol!!", emoji: "../../imagenes/carta-verde.png", dice:"sol" },
  { color: "#3358BC", fondo: "#8ECFFE", texto: "Di Rana!!", emoji: "../../imagenes/carta-azul.png", dice:"rana" },
  { color: "#B90EAE", fondo: "#E8B6E4", texto: "Di Mariposa!!", emoji: "../../imagenes/carta-violeta.png", dice:"mariposa" }
];

// ELEMENTOS DEL HTML 
const ejercicio = document.getElementById('ejercicio');   
const tablero = document.getElementById('tablero');       
const flechaIntro = document.getElementById('flechaIntro');
const popup = document.getElementById('popup');
const textoPopup = document.getElementById('textoPopup');
const flechaPopup = document.getElementById('flechaPopup');
const altavoz = document.getElementById('altavoz');
const jugarOtraVez = document.getElementById('jugarOtraVez');
const emojiPopup = document.getElementById('emoji');
//agregar el boton de salir del final junto el volver a jugar
//despues agregar las imagenes tmb

//  VARIABLES DEL JUEGO 
let primera = null;      // guarda la primera carta que se dio vuelta (null = todavía ninguna)
let bloqueado = true;    // si es true, los clics en las cartas se ignoran (empieza bloqueado por la intro)
let encontrados = 0;     // cuántos pares lleva encontrados
let parActual = [];      // las dos cartas que acaban de coincidir (para eliminarlas después)

//   MEZCLAR 
// Igual que el segundo juego
function mezclar(lista) {
  const restantes = [...lista];                       
  const resultado = [];                               
  while (restantes.length > 0) {                    
    const i = Math.floor(Math.random() * restantes.length); 
    resultado.push(restantes.splice(i, 1)[0]);        
  }
  return resultado;
}

//  CREAR LAS CARTAS 
function crearTablero() {
  const cartas = [];
  pares.forEach(par => {
    cartas.push(par);
    cartas.push(par); // Cada par esta dos veces asi son iguales
  });

  // Se mezclan con la funcion de antes las cartas q creamos
  const mezcladas = mezclar(cartas);

  // Por cada una se crea un botón y se agrega al tablero
  mezcladas.forEach(par => {
    const carta = document.createElement('button');  // crea un <button> nuevo
    carta.className = 'carta';                        // le pone la clase del CSS
    carta.dataset.color = par.color;                  // guarda su color en el botón (data-color)
    carta.dataset.fondo = par.fondo;
    carta.dataset.texto = par.texto;                  // y su texto de adentro (data-texto)
    carta.dataset.emoji = par.emoji;
    carta.dataset.dice = par.dice;
    carta.addEventListener('click', () => tocarCarta(carta)); // al tocarla
    tablero.appendChild(carta);                       // la mete adentro del tablero
  });
}

//  CAMBIAR DE PANTALLA
// Le pone al cuadro la clase del modo que queremos 
function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

//  DAR VUELTA UNA CARTA
function voltear(carta) {
  carta.classList.add('volteada');
  carta.style.borderColor = carta.dataset.color;  // le da el color al borde
}

function desvoltear(carta) {
  carta.classList.remove('volteada');
  carta.style.borderColor = '';                   // le da el borde normal
}

// LO QUE PASA AL TOCAR UNA CARTA
function tocarCarta(carta) {
  if (bloqueado) return;                              // si está bloqueado, no hace nada
  if (carta.classList.contains('volteada')) return;   // si ya está dada vuelta, no hace nada

  voltear(carta);                                     // muestra el borde con color

  // si es la primera carta de la jugada, se espera la segunda
  if (primera === null) {
    primera = carta;
    return;
  }

  // la segunda carta, hay que comparar
  const anterior = primera;         // la copiamos para usarla en setTimeout
  primera = null;                   // la jugada termina: empieza de cero
  bloqueado = true;                 // mientras se compara no se puede tocar nada
 
if (anterior.dataset.color === carta.dataset.color) { //si son iguales:
  parActual = [anterior, carta];
  setTimeout(() => { //set timeout sirve para que pase una sola vez despues de un tiempo (en este caso 600ms) 
    mostrarPopup(
      carta.dataset.texto, 
      carta.dataset.color, 
      carta.dataset.fondo, 
      carta.dataset.emoji,
      carta.dataset.dice
    );
  }, 600);
} else {
    // NO COINCIDEN 
    setTimeout(() => {
      desvoltear(anterior);  // da vuelta la primera carta
      desvoltear(carta);     // y la segunda
      bloqueado = false;     // para poder seguir jugando
    }, 1000); //unos segundos dsp para q vea de q colores son
  }
}

//  POPUP DEL EJERCICIO
function mostrarPopup(texto, color, fondo, emoji, palabra) {
  textoPopup.textContent = texto;
  textoPopup.classList.add('tipografia'&&'grande'); //para agregarle la clase

  popup.style.borderColor = ""; //el borde del pop es igual al del css
  popup.style.backgroundColor = fondo; //los colores del principio q puse

  popup.classList.add('visible'); //antes estaba invisible

  if (emojiPopup) {
    emojiPopup.src = emoji;  //agrege el icono de las cartas
  }

  if (altavoz) {
    altavoz.dataset.dice = palabra; 
  }

}

// Lee la palabra con la voz del navegador
function hablar() {
  if (!('speechSynthesis' in window)) return;
  
  // Lee la palabra guardada en el altavoz (si no hay nada, no dice nada)
  const textoADecir = altavoz.dataset.dice; 
  if (!textoADecir) return;

  window.speechSynthesis.cancel(); // corta lo que estuviera sonando
  
  const voz = new SpeechSynthesisUtterance(textoADecir); 
  voz.lang = 'es-AR'; // idioma 
  
  window.speechSynthesis.speak(voz);
}

// Al tocar la flecha se cierra y se eliminan las dos cartas
function cerrarPopup() {
  popup.classList.remove('visible');                  // esconde el popup
  window.speechSynthesis.cancel();                    // por si todavía estaba hablando

  parActual.forEach(carta => carta.classList.add('eliminada')); // el CSS las esconde
  parActual = [];
  encontrados++;                                      // suma un par

  if (encontrados === pares.length) {
    mostrarModo('modo-final');                        // encontró todos: pantalla de que ganó
    // window.location.href = '../principal/pantalla-atras.html'; // si querés redirigir al terminar
  } else {
    bloqueado = false;                                // si faltan, sigue jugando
  }
}

// EMPEZAR EL JUEGO
function empezar() {
  mostrarModo('modo-juego');              // pasa de la explicación al tablero
  bloqueado = false;                      // ahora se pueden tocar las cartas
}

//  Q pasa si se toca cada cosa
flechaIntro.addEventListener('click', empezar);
flechaPopup.addEventListener('click', cerrarPopup);
altavoz.addEventListener('click', hablar);
jugarOtraVez.addEventListener('click', () => location.reload()); // recargar hace q se reinicie

// EMPEZAR
crearTablero(); 




// ===== BOTÓN X Y POPUP DE SALIR =====
const cerrar = document.getElementById('cerrar');
const modalSalir = document.getElementById('modalSalir');
const seguirJugando = document.getElementById('seguirJugando');
const salirJuego = document.getElementById('salirJuego');

function salir() {
  window.location.href = '../principal/pantalla-atras.html';
}

cerrar.addEventListener('click', () => {
  if (ejercicio.classList.contains('modo-final')) {
    salir();                              // en la pantalla final se cierra de una
  } else {
    modalSalir.classList.add('visible');  // si no, pregunta primero
  }
});

seguirJugando.addEventListener('click', () => modalSalir.classList.remove('visible')); // vuelve al juego
salirJuego.addEventListener('click', salir);