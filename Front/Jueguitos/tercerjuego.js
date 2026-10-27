//Los colores de los pares predeterminados
const pares = [
  { color: "#B7383A", texto: "Di Ratón!!" },
  { color: "#E2863C", texto: "Di Pelota!!" },
  { color: "#2AA418", texto: "Di Sol!!" },
  { color: "#3358BC", texto: "Di Rana!!" },
  { color: "#B90EAE", texto: "Di Mariposa!!" }
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
//agregar el boton de salir del final junto el volver a jugar

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
    carta.dataset.texto = par.texto;                  // y su texto de adentro (data-texto)
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
  carta.style.borderColor = carta.dataset.color;  // asigna el color al borde
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
// -------------------------------------- segui de aca
  // CASO A: es la primera carta de la jugada. Se guarda y se espera la segunda.
  if (primera === null) {
    primera = carta;
    return;
  }

  // CASO B: es la segunda carta. Hay que comparar.
  const anterior = primera;                           // copia de la primera, para usarla adentro del setTimeout
  primera = null;                                     // la jugada termina: la próxima vez empieza de cero
  bloqueado = true;                                   // mientras se compara no se puede tocar nada

  if (anterior.dataset.color === carta.dataset.color) {
    // COINCIDEN (mismo color): se espera un poquito para que se vean y sale el popup
    parActual = [anterior, carta];
    setTimeout(() => mostrarPopup(carta.dataset.texto, carta.dataset.color), 600);
  } else {
    // NO COINCIDEN: se dejan 1 segundo a la vista y se vuelven a dar vuelta las dos
    setTimeout(() => {
      desvoltear(anterior);
      desvoltear(carta);
      bloqueado = false;                              // ahora sí se puede seguir jugando
    }, 1000);
  }
}

// ==================  POPUP DEL EJERCICIO ==================
function mostrarPopup(texto, color) {
  textoPopup.textContent = texto;                     // escribe la palabra
  popup.style.backgroundColor = color;                // el popup toma el color del par
  popup.classList.add('visible');                     // lo muestra (el CSS lo pone display: flex)
}

// Lee la palabra en voz alta con el parlante (la voz del navegador)
function hablar() {
  if (!('speechSynthesis' in window)) return;         // si el navegador no puede, no hace nada
  window.speechSynthesis.cancel();                    // corta lo que estuviera sonando
  const voz = new SpeechSynthesisUtterance(textoPopup.textContent); // lo que va a decir
  voz.lang = 'es-AR';                                 // idioma: español
  window.speechSynthesis.speak(voz);                  // lo dice
}

// Al tocar la flecha del popup: se cierra y se eliminan las dos cartas
function cerrarPopup() {
  popup.classList.remove('visible');                  // esconde el popup
  window.speechSynthesis.cancel();                    // por si todavía estaba hablando

  parActual.forEach(carta => carta.classList.add('eliminada')); // desaparecen (el CSS las esconde)
  parActual = [];
  encontrados++;                                      // suma un par

  if (encontrados === pares.length) {
    mostrarModo('modo-final');                        // encontró todos: pantalla de que ganó
    // window.location.href = '../principal/pantalla-atras.html'; // si querés redirigir al terminar
  } else {
    bloqueado = false;                                // si faltan, sigue jugando
  }
}

// ================== EMPEZAR EL JUEGO ==================
function empezar() {
  mostrarModo('modo-juego');                          // pasa de la explicación al tablero
  bloqueado = false;                                  // ahora se pueden tocar las cartas
}

// ==================  EVENTOS (qué pasa al tocar cada cosa) ==================
flechaIntro.addEventListener('click', empezar);
flechaPopup.addEventListener('click', cerrarPopup);
altavoz.addEventListener('click', hablar);
jugarOtraVez.addEventListener('click', () => location.reload()); // recargar = nueva mezcla

// EMPEZAR
crearTablero(); 