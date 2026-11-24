const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 2;

function obtenerIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario ? usuario.id : null;
}

const preguntas = [
  {
    pregunta: "¿Qué preferís...\n Pizza o Hamburguesa?",
    opciones: [
      { texto: "Pizza",       imagen: "../../imagenes/segundo-pizza.png", color: "#e97f7f" },
      { texto: "Hamburguesa", imagen: "../../imagenes/segundo-hamburguesa.png", color: "#e2ec55" }
    ],
    ejercicio: {
      titulo: "¡Mandá 10 besos hacia la derecha!",
      explicacion: " Como se hace? \n 1. Hacé la forma de un beso con los labios y llevalos hacia la derecha. \n 2. Mantené los labios en esa posición por 10 segundos mirando al frente. \n 3. Relajá los labios y repetí."
    }
  },
  {
    pregunta: "¿Qué preferís...\n Perro o Gato?",
    opciones: [
      { texto: "Perro", imagen:"../../imagenes/segundo-perro.png", color: "#E87575" },
      { texto: "Gato",  imagen:"../../imagenes/segundo-gato.png", color: "#ABB1A6" }
    ],
    ejercicio: {
      titulo: "¡Sonreí enseñando los dientes 10 veces!",
      explicacion: "¿Cómo se hace? \n 1. Hacé una sonrisa bien grande mostrando los dientes. \n 2. Mantené la sonrisa por 10 segundos. \n 3. Relajá la boca y repetí."
    }
  },
  {
    pregunta: "¿Qué preferís...\n  Playa o Montaña?",
    opciones: [
      { texto: "Playa",   imagen :"../../imagenes/segundo-playa.png", color: "#F2D2A8" },
      { texto: "Montaña", imagen:"../../imagenes/segundo-montaña.png", color: "#99E556" }
    ],
    ejercicio: {
      titulo: "¡Posiciona el labio superior sobre el labio inferior 10 veces!",
      explicacion: "¿Cómo se hace? \n 1. Apoyá el labio de arriba sobre el de abajo presionando suavemente ¡Sin abrir la boca! \n 2. Mantené los labios así por 10 segundos. \n 3. Relajá los labios y repetí."
    }
  },
  {
    pregunta: "¿Qué preferís...\n  Avión o Barco?",
    opciones: [
      { texto: "Avion",  imagen: "../../imagenes/segundo-avion.png", color: "#C3DDF2" },
      { texto: "Barco", imagen: "../../imagenes/segundo-barco.png", color: "#8880F5" }
    ],
    ejercicio: {
      titulo: "¡Apreta los labios 10 veces!",
      explicacion: "¿Cómo se hace? \n 1. Juntá y apretá los labios suavemente sin abrir la boca. \n 2. Mantené tus labios así por 10 segundos. \n 3. Relajá los labios y repetí."
    }
  },
  {
    pregunta: "¿Qué preferís...\n Helado o Chocolate?",
    opciones: [
      { texto: "Helado",   imagen: "../../imagenes/segundo-helado.png", color: "#F29CF0" },
      { texto: "Chocolate", imagen: "../../imagenes/segundo-chocolate.png", color: "#BA816E" }
    ],
    ejercicio: {
      titulo: "¡Hacé un beso y luego sonreí enseñando los dientes 10 veces!",
      explicacion: "¿Cómo se hace? \n 1. Estirá los labios en forma de beso y mantené por 5 segundos. \n 2. Cambiá a una sonrisa mostrando los dientes y mantené por 5 segundos. \n 3. Relajá los labios y repetí."
    }
  }
];

const ejercicio = document.getElementById('ejercicio');
const flechaIntro = document.getElementById('flechaIntro');
const flechaEjercicio = document.getElementById('flechaEjercicio');
const textoPregunta = document.getElementById('textoPregunta');
const tituloOpcion = document.getElementById('tituloOpcion');
const tituloEjercicio = document.getElementById('tituloEjercicio');
const explicacionEjercicio = document.getElementById('explicacionEjercicio');
const jugarOtraVez = document.getElementById('jugarOtraVez');

const botones = [
  document.getElementById('opcionA'),
  document.getElementById('opcionB')
];

function mezclar(lista) {
  const restantes = [...lista];
  const resultado = [];

  while (restantes.length > 0) {
    const i = Math.floor(Math.random() * restantes.length);
    const elegida = restantes.splice(i, 1)[0];
    resultado.push(elegida);
  }

  return resultado;
}

const orden = mezclar(preguntas);
let indice = 0;

function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
  ejercicio.style.backgroundColor = '';
}

function mostrarPregunta() {
  const p = orden[indice];
  textoPregunta.textContent = p.pregunta;

  botones.forEach((boton, i) => {
    const op = p.opciones[i];
    boton.querySelector('.op-texto').textContent = op.texto;
    boton.querySelector('.op-img').src = op.imagen;
    boton.style.backgroundColor = op.color;
  });

  mostrarModo('modo-pregunta');
}

function elegir(numero) {
  const p = orden[indice];
  const op = p.opciones[numero];

  tituloOpcion.innerHTML = `
  <img class="titulo-img derecha" src="${op.imagen}" alt="">
  ${op.texto}!!
  <img class="titulo-img" src="${op.imagen}" alt="">
`;

  tituloEjercicio.textContent = p.ejercicio.titulo;
  explicacionEjercicio.innerHTML = p.ejercicio.explicacion.replace(/\n/g, '<br>');

  mostrarModo('modo-ejercicio');
  ejercicio.style.backgroundColor = op.color;
}

let resultadoEnviado = false;

function siguiente() {
  indice++;
  if (indice >= orden.length) {
    mostrarModo('modo-final');
    enviarResultado();
  } else {
    mostrarPregunta();
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

flechaIntro.addEventListener('click', mostrarPregunta);
flechaEjercicio.addEventListener('click', siguiente);
botones[0].addEventListener('click', () => elegir(0));
botones[1].addEventListener('click', () => elegir(1));

jugarOtraVez.addEventListener('click', () => location.reload());

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