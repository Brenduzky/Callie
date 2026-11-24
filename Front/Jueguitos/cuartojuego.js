const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 4;

function obtenerIdUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario ? usuario.id : null;
}

let resultadoEnviado = false;

const palabras = [
    { palabra: "PERRO",     dice: "perro",     imagen: "../../imagenes/cuartojuego-perro.png" },
    { palabra: "RATON",     dice: "ratón",     imagen: "../../imagenes/memotest-verde-raton.png" },
    { palabra: "FRUTA",     dice: "fruta",     imagen: "../../imagenes/memotest-violeta-uvas.png" },
    { palabra: "TREN",      dice: "tren",      imagen: "../../imagenes/memotest-rojo-tren.png" },
    { palabra: "GUITARRA",  dice: "guitarra",  imagen: "../../imagenes/memotest-naranja-guitarra.png" },
    { palabra: "SAPO",      dice: "sapo",      imagen: "../../imagenes/cuartojuego-sapo.png" },
    { palabra: "SOL",       dice: "sol",       imagen: "../../imagenes/cuartojuego-sol.png" },
    { palabra: "SILLA",     dice: "silla",     imagen: "../../imagenes/cuartojuego-silla.png" },
    { palabra: "ESCUELA",   dice: "escuela",   imagen: "../../imagenes/cuartojuego-escuela.png" },
    { palabra: "SERPIENTE", dice: "serpiente", imagen: "../../imagenes/cuartojuego-serpiente.png" }
  ];
  
  const PALABRAS_POR_PARTIDA = 5;
  
  const ejercicio = document.getElementById('ejercicio');
  const flechaIntro = document.getElementById('flechaIntro');
  const juego = document.getElementById('juego');
  const contador = document.getElementById('contador');
  const mensaje = document.getElementById('mensaje');
  const contenedorLetras = document.getElementById('letras');
  const imgIzq = document.getElementById('imgIzq');
  const imgDer = document.getElementById('imgDer');
  const espacioIzq = document.getElementById('espacioIzq');
  const espacioDer = document.getElementById('espacioDer');
  const botonRevisar = document.getElementById('revisar');
  const altavoz = document.getElementById('altavoz');
  const flechaSiguiente = document.getElementById('flechaSiguiente');
  const jugarOtraVez = document.getElementById('jugarOtraVez');
  
  let rondas = [];
  let indice = 0;
  let palabraActual;
  let letras = [];
  let seleccionada;
  
  function mezclar(lista) {
    const restantes = [...lista];
    const resultado = [];
    while (restantes.length > 0) {
      const i = Math.floor(Math.random() * restantes.length);
      resultado.push(restantes.splice(i, 1)[0]);
    }
    return resultado;
  }
  
  function desordenar(palabra) {
    const original = palabra.split('');
    let intento;
    do {
      intento = mezclar(original);
    } while (intento.join('') === palabra);
    return intento;
  }
  
  function mostrarModo(modo) {
    ejercicio.className = 'ejercicio ' + modo;
  }
  
  function cambiarEstado(estado) {
    juego.dataset.estado = estado;
    if (estado === 'ordenar') {
      mensaje.textContent = 'Selecciona las letras y muevelas para formar la palabra!!';
    } else if (estado === 'casi') {
      mensaje.textContent = 'Casi lo logras!! Vas por buen camino!!';
    } else if (estado === 'bien') {
      mensaje.textContent = 'Muy Bien!!! Ahora di la palabra';
    }
  }
  
  function ponerImagen(img, espacio, link) {
    if (link) {
      img.src = link;
      espacio.classList.remove('sin-imagen');
    } else {
      img.removeAttribute('src');
      espacio.classList.add('sin-imagen');
    }
  }
  
  function empezarPartida() {
    rondas = mezclar(palabras).slice(0, PALABRAS_POR_PARTIDA);
    indice = 0;
    cargarPalabra();
  }
  
  function cargarPalabra() {
    palabraActual = rondas[indice];
  
    letras = desordenar(palabraActual.palabra).map(c => ({ char: c, estado: 'neutro' }));
    seleccionada = null;
  
    ponerImagen(imgIzq, espacioIzq, palabraActual.imagen);
    ponerImagen(imgDer, espacioDer, palabraActual.imagen);
  
    cambiarEstado('ordenar');
    dibujarLetras();
  }
  
  function dibujarLetras() {
    contenedorLetras.innerHTML = '';
    letras.forEach((l, i) => {
      const boton = document.createElement('button');
      boton.className = 'letra ' + l.estado + (i === seleccionada ? ' seleccionada' : '');
      
      const candadoImg = `<img src="../../imagenes/candado.png" alt="Candado" class="icono-candado">`;
      
      boton.innerHTML =
        `<span class="caja">${l.char}</span>` +
        `<span class="barra">${l.estado === 'bien' ? candadoImg : ''}</span>`;
        
      boton.disabled = (l.estado === 'bien');
      boton.addEventListener('click', () => seleccionarLetra(i));
      contenedorLetras.appendChild(boton);
    });
  }
  
  function seleccionarLetra(i) {
    if (juego.dataset.estado === 'bien') return;
    seleccionada = (seleccionada === i) ? null : i;
    dibujarLetras();
  }
  
  function moverLetra(direccion) {
    if (seleccionada === null) return;
    if (juego.dataset.estado === 'bien') return;
  
    let j = seleccionada + direccion;
    while (j >= 0 && j < letras.length && letras[j].estado === 'bien') j += direccion;
    if (j < 0 || j >= letras.length) return;
  
    const guardada = letras[seleccionada];
    letras[seleccionada] = letras[j];
    letras[j] = guardada;
  
    seleccionada = j;
  
    letras.forEach(l => { if (l.estado === 'mal') l.estado = 'neutro'; });
  
    dibujarLetras();
  }
  
  document.addEventListener('keydown', (e) => {
    if (!ejercicio.classList.contains('modo-juego')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moverLetra(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moverLetra(1);
    }
  });
  
  function revisar() {
    const correcta = palabraActual.palabra;
    seleccionada = null;
  
    letras.forEach((l, i) => {
      l.estado = (l.char === correcta[i]) ? 'bien' : 'mal';
    });
  
    const todasBien = letras.every(l => l.estado === 'bien');
    if (todasBien) {
      cambiarEstado('bien');
      hablar(palabraActual.dice);
    } else {
      cambiarEstado('casi');
    }
    dibujarLetras();
  }
  
  function hablar(texto) {
    if (!('speechSynthesis' in window)) return;
    if (!texto) return;
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-AR';
    window.speechSynthesis.speak(voz);
  }
  
function siguiente() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  indice++;
  if (indice >= rondas.length) {
    mostrarModo('modo-final');
    enviarResultado();
  } else {
    cargarPalabra();
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
    empezarPartida();
  }
  
  flechaIntro.addEventListener('click', empezar);
  botonRevisar.addEventListener('click', revisar);
  altavoz.addEventListener('click', () => hablar(palabraActual.dice));
  flechaSiguiente.addEventListener('click', siguiente);
jugarOtraVez.addEventListener('click', () => {
  resultadoEnviado = false;
  mostrarModo('modo-juego');
  empezarPartida();
});
  
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