const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 3;

function obtenerIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario ? usuario.id : null;
}

let resultadoEnviado = false;

const pares = [
  { color: "#B7383A", fondo: "#F6A7A8", texto: "Di Tren!!", emoji: "../../imagenes/carta-roja-.png", foto: "../../imagenes/memotest-rojo-tren.png", dice:"Tren" },
  { color: "#E2863C", fondo: "#FEC08E", texto: "Di Guitarra!!", emoji: "../../imagenes/carta-naranja.png", foto: "../../imagenes/memotest-naranja-guitarra.png",dice:"guitarra" },
  { color: "#2AA418", fondo: "#B0E995", texto: "Di Raton!!", emoji: "../../imagenes/carta-verde.png", foto: "../../imagenes/memotest-verde-raton.png", dice:"ratón" },
  { color: "#3358BC", fondo: "#8ECFFE", texto: "Di Perro!!", emoji: "../../imagenes/carta-azul.png", foto: "../../imagenes/memotest-azul-perro.png", dice:"perro" },
  { color: "#B90EAE", fondo: "#E8B6E4", texto: "Di Fruta!!", emoji: "../../imagenes/carta-violeta.png", foto: "../../imagenes/memotest-violeta-uvas.png", dice:"fruta" }
];

const ejercicio = document.getElementById('ejercicio');   
const tablero = document.getElementById('tablero');       
const flechaIntro = document.getElementById('flechaIntro');
const popup = document.getElementById('popup');
const textoPopup = document.getElementById('textoPopup');
const flechaPopup = document.getElementById('flechaPopup');
const altavoz = document.getElementById('altavoz');
const jugarOtraVez = document.getElementById('jugarOtraVez');
const emojiPopup = document.getElementById('emoji');

let primera = null;
let bloqueado = true;
let encontrados = 0;
let parActual = [];

function mezclar(lista) {
  const restantes = [...lista];                       
  const resultado = [];                               
  while (restantes.length > 0) {                    
    const i = Math.floor(Math.random() * restantes.length); 
    resultado.push(restantes.splice(i, 1)[0]);        
  }
  return resultado;
}

function crearTablero() {
  const cartas = [];
  pares.forEach(par => {
    cartas.push(par);
    cartas.push(par);
  });

  const mezcladas = mezclar(cartas);

  mezcladas.forEach(par => {
    const carta = document.createElement('button');
    carta.className = 'carta';
    carta.dataset.color = par.color;
    carta.dataset.fondo = par.fondo;
    carta.dataset.texto = par.texto;
    carta.dataset.emoji = par.emoji;
    carta.dataset.foto = par.foto;
    carta.dataset.dice = par.dice;
    carta.addEventListener('click', () => tocarCarta(carta));
    tablero.appendChild(carta);
  });
}

function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
}

function voltear(carta) {
  carta.classList.add('volteada');
  carta.style.borderColor = carta.dataset.color;
  carta.innerHTML = `<img src="${carta.dataset.foto}" alt="Imagen de la carta">`;
}

function desvoltear(carta) {
  carta.classList.remove('volteada');
  carta.style.borderColor = '';
  carta.innerHTML = '';
}

function tocarCarta(carta) {
  if (bloqueado) return;
  if (carta.classList.contains('volteada')) return;

  voltear(carta);

  if (primera === null) {
    primera = carta;
    return;
  }

  const anterior = primera;
  primera = null;
  bloqueado = true;
 
  if (anterior.dataset.color === carta.dataset.color) {
    parActual = [anterior, carta];
    setTimeout(() => {
      mostrarPopup(
        carta.dataset.texto, 
        carta.dataset.color, 
        carta.dataset.fondo, 
        carta.dataset.emoji,
        carta.dataset.dice
      );
    }, 600);
  } else {
    setTimeout(() => {
      desvoltear(anterior);
      desvoltear(carta);
      bloqueado = false;
    }, 1000);
  }
}

function mostrarPopup(texto, color, fondo, emoji, palabra) {
  textoPopup.textContent = texto;
  textoPopup.classList.add('tipografia', 'grande');

  popup.style.borderColor = "";
  popup.style.backgroundColor = fondo;

  popup.classList.add('visible');

  if (emojiPopup) {
    emojiPopup.src = emoji;
  }

  if (altavoz) {
    altavoz.dataset.dice = palabra; 
  }
}

function hablar() {
  if (!('speechSynthesis' in window)) return;
  
  const textoADecir = altavoz.dataset.dice; 
  if (!textoADecir) return;

  window.speechSynthesis.cancel();
  
  const voz = new SpeechSynthesisUtterance(textoADecir); 
  voz.lang = 'es-AR';
  
  window.speechSynthesis.speak(voz);
}

function cerrarPopup() {
  popup.classList.remove('visible');
  window.speechSynthesis.cancel();

  parActual.forEach(carta => carta.classList.add('eliminada'));
  parActual = [];
  encontrados++;

  if (encontrados === pares.length) {
    mostrarModo('modo-final');
    enviarResultado();
  } else {
    bloqueado = false;
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
  mostrarModo('modo-juego');
  bloqueado = false;
}

flechaIntro.addEventListener('click', empezar);
flechaPopup.addEventListener('click', cerrarPopup);
altavoz.addEventListener('click', hablar);
jugarOtraVez.addEventListener('click', () => location.reload());

crearTablero(); 

const cerrar = document.getElementById('cerrar');
const modalSalir = document.getElementById('modalSalir');
const seguirJugando = document.getElementById('seguirJugando');
const salirJuego = document.getElementById('salirJuego');

function salir() {
  window.location.href = '../principal/pantalla-atras.html';
}

cerrar.addEventListener('click', () => {
  if (ejercicio.classList.contains('modo-final')) {
    salir();
  } else {
    modalSalir.classList.add('visible');
  }
});

seguirJugando.addEventListener('click', () => modalSalir.classList.remove('visible'));
salirJuego.addEventListener('click', salir);