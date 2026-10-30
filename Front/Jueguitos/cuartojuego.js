// ===== LAS PALABRAS DEL JUEGO =====
// palabra: como se ve en pantalla (en mayúscula)
// dice:    como la lee la voz del navegador (con tilde, así suena bien)
// imagen:  PEGÁ ACÁ EL LINK DE LA IMAGEN (ej: "../../imagenes/perro.png")
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
  
  const PALABRAS_POR_PARTIDA = 5; // cuántas palabras juega cada vez
  
  // ===== ELEMENTOS DEL HTML =====
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
  
  // ===== VARIABLES DEL JUEGO =====
  let rondas = [];          // las 5 palabras elegidas para esta partida
  let indice = 0;           // en cuál de las 5 va (0 = la primera)
  let palabraActual; // la palabra que se está jugando (objeto de la lista)
  let letras = [];          // las letras en pantalla: { char: "P", estado: "neutro" | "bien" | "mal" }
  let seleccionada;  // posición de la letra seleccionada (null = ninguna)
  
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
  
  // Desordena las letras de una palabra, pero se asegura de que NO quede ya bien armada
  function desordenar(palabra) {
    const original = palabra.split('');
    let intento;
    do {
      intento = mezclar(original);
    } while (intento.join('') === palabra);
    return intento;
  }
  
  // ===== CAMBIAR DE PANTALLA =====
  function mostrarModo(modo) {
    ejercicio.className = 'ejercicio ' + modo;
  }
  
  // Cambia el "estado" del juego: ordenar / casi / bien (el CSS muestra u oculta botones según esto)
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
  
  // ===== IMAGEN DE LA PALABRA =====
  // Si hay link se muestra la imagen; si no, queda el cuadrito punteado de "IMG"
  function ponerImagen(img, espacio, link) {
    if (link) {
      img.src = link;
      espacio.classList.remove('sin-imagen');
    } else {
      img.removeAttribute('src');
      espacio.classList.add('sin-imagen');
    }
  }
  
  // ===== EMPEZAR UNA PARTIDA =====
  function empezarPartida() {
    rondas = mezclar(palabras).slice(0, PALABRAS_POR_PARTIDA); // 5 palabras al azar de las 10
    indice = 0;
    cargarPalabra();
  }
  
  // ===== CARGAR LA PALABRA DE LA RONDA ACTUAL =====
  function cargarPalabra() {
    palabraActual = rondas[indice];
  
    // arma las letras desordenadas, todas "neutro" (barra azul)
    letras = desordenar(palabraActual.palabra).map(c => ({ char: c, estado: 'neutro' }));
    seleccionada = null;
  
    ponerImagen(imgIzq, espacioIzq, palabraActual.imagen);
    ponerImagen(imgDer, espacioDer, palabraActual.imagen);
  
    //contador.textContent = 'Palabra ' + (indice + 1) + ' de ' + rondas.length;
    cambiarEstado('ordenar');
    dibujarLetras();
  }
  
  // ===== DIBUJAR LAS LETRAS =====
  // Borra lo que había y vuelve a crear un botón por cada letra
  function dibujarLetras() {
    contenedorLetras.innerHTML = '';
    letras.forEach((l, i) => {
      const boton = document.createElement('button');
      boton.className = 'letra ' + l.estado + (i === seleccionada ? ' seleccionada' : ''); // la clase decide el color de la barrita y si está agrandada
      
      // Cambiamos el emoji por una etiqueta <img>
      const candadoImg = `<img src="../../imagenes/candado.png" alt="Candado" class="icono-candado">`;
      
      boton.innerHTML =
        `<span class="caja">${l.char}</span>` +
        `<span class="barra">${l.estado === 'bien' ? candadoImg : ''}</span>`;
        
      boton.disabled = (l.estado === 'bien'); // las letras con candado no se tocan
      boton.addEventListener('click', () => seleccionarLetra(i));
      contenedorLetras.appendChild(boton);
    });
  }
  
  // ===== SELECCIONAR UNA LETRA =====
  // Al tocarla con el mouse (o el dedo) queda seleccionada: se anima y se agranda.
  // Si se vuelve a tocar la misma, se deselecciona.
  function seleccionarLetra(i) {
    if (juego.dataset.estado === 'bien') return;       // ya la armó: no se toca más
    seleccionada = (seleccionada === i) ? null : i;
    dibujarLetras();
  }
  
  // ===== MOVER LA LETRA SELECCIONADA =====
  // direccion: -1 = flecha izquierda, +1 = flecha derecha
  // La letra se intercambia con su vecina de ese lado.
  // - En los extremos NO da la vuelta: si está a la izquierda del todo y se aprieta
  //   izquierda, no pasa nada (igual con la derecha).
  // - Si la vecina tiene candado, se salta y se usa la siguiente sin candado
  //   (así siempre se puede terminar de armar la palabra).
  function moverLetra(direccion) {
    if (seleccionada === null) return;                 // no hay letra seleccionada
    if (juego.dataset.estado === 'bien') return;       // ya la armó
  
    let j = seleccionada + direccion;
    while (j >= 0 && j < letras.length && letras[j].estado === 'bien') j += direccion;
    if (j < 0 || j >= letras.length) return;           // se pasó del borde: no hace nada
  
    // intercambia las dos letras
    const guardada = letras[seleccionada];
    letras[seleccionada] = letras[j];
    letras[j] = guardada;
  
    seleccionada = j;                                  // la selección la sigue (para poder seguir moviéndola)
  
    // las barras rojas vuelven a azul porque la persona ya movió algo
    letras.forEach(l => { if (l.estado === 'mal') l.estado = 'neutro'; });
  
    dibujarLetras();
  }
  
  // ===== DETECTAR LAS FLECHAS DEL TECLADO =====
  document.addEventListener('keydown', (e) => {
    if (!ejercicio.classList.contains('modo-juego')) return;   // solo mientras se juega
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moverLetra(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moverLetra(1);
    }
  });
  
  // ===== REVISAR =====
  function revisar() {
    const correcta = palabraActual.palabra;
    seleccionada = null;                               // al revisar se deselecciona
  
    // cada letra: si está en su lugar -> "bien" (verde con candado), si no -> "mal" (rojo)
    letras.forEach((l, i) => {
      l.estado = (l.char === correcta[i]) ? 'bien' : 'mal';
    });
  
    const todasBien = letras.every(l => l.estado === 'bien');
    if (todasBien) {
      cambiarEstado('bien');                // pantalla 4: Muy bien + altavoz + flecha
      hablar(palabraActual.dice);           // la dice automáticamente
    } else {
      cambiarEstado('casi');                // pantalla 3: Casi lo logras
    }
    dibujarLetras();
  }
  
  // ===== VOZ DEL NAVEGADOR =====
  function hablar(texto) {
    if (!('speechSynthesis' in window)) return;
    if (!texto) return;
    window.speechSynthesis.cancel();                   // corta lo que estuviera sonando
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-AR';
    window.speechSynthesis.speak(voz);
  }
  
  // ===== PASAR A LA PRÓXIMA PALABRA =====
  function siguiente() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    indice++;
    if (indice >= rondas.length) {
      mostrarModo('modo-final');             // hizo las 5: pantalla de que ganó
    } else {
      cargarPalabra();
    }
  }
  
  // ===== EMPEZAR EL JUEGO (sale de la intro) =====
  function empezar() {
    mostrarModo('modo-juego');
    empezarPartida();
  }
  
  // ===== Q PASA SI SE TOCA CADA COSA =====
  flechaIntro.addEventListener('click', empezar);
  botonRevisar.addEventListener('click', revisar);
  altavoz.addEventListener('click', () => hablar(palabraActual.dice));
  flechaSiguiente.addEventListener('click', siguiente);
  jugarOtraVez.addEventListener('click', () => {
    mostrarModo('modo-juego');
    empezarPartida();                        // arma 5 palabras nuevas
  });
  
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
      salir();                               // en la pantalla final se cierra de una
    } else {
      modalSalir.classList.add('visible');   // si no, pregunta primero
    }
  });
  
  seguirJugando.addEventListener('click', () => modalSalir.classList.remove('visible'));
  salirJuego.addEventListener('click', salir);