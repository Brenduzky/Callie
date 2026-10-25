const preguntas = [ //todas las preguntas con sus ejercicios
  {
    pregunta: "¿Qué preferís...\nPizza o Hamburguesa?", //el \n es un salto de línea, para que quede en dos renglones
    opciones: [
      { texto: "Pizza",       emoji: "🍕", color: "#e97f7f" }, //proximamente cambiarlo a img (drive: "Poner imagen: Segundo juego opciones")
      { texto: "Hamburguesa", emoji: "🍔", color: "#e2ec55" }
    ],
    ejercicio: {
      titulo: "Debes hacer 10 besos!",
      explicacion: "¿Cómo se hace? Cierra la boca y empuja tus labios hacia adelante y arriba, sin separarlos. Mantenlo así por 10 segundos."
    }
  },
  {
    pregunta: "¿Qué preferís...\nPerro o Gato?",
    opciones: [
      { texto: "Perro", emoji: "🐶", color: "#f0b27a" },
      { texto: "Gato",  emoji: "🐱", color: "#c39bd3" }
    ],
    ejercicio: {
      titulo: "Infla las mejillas!",
      explicacion: "¿Cómo se hace? Llena tus mejillas de aire como un globo y mantenlo 5 segundos. Repítelo 3 veces."
    }
  },
  {
    pregunta: "¿Qué preferís...\nPlaya o Montaña?",
    opciones: [
      { texto: "Playa",   emoji: "🏖️", color: "#f7dc6f" },
      { texto: "Montaña", emoji: "⛰️", color: "#82e0aa" }
    ],
    ejercicio: {
      titulo: "Sonrisa gigante!",
      explicacion: "¿Cómo se hace? Sonríe lo más grande que puedas sin abrir la boca y mantenlo 10 segundos."
    }
  },
  {
    pregunta: "¿Qué preferís...\nDulce o Salado?",
    opciones: [
      { texto: "Dulce",  emoji: "🍫", color: "#d7a58c" },
      { texto: "Salado", emoji: "🍟", color: "#f9e79f" }
    ],
    ejercicio: {
      titulo: "Saca la lengua!",
      explicacion: "¿Cómo se hace? Saca la lengua lo más que puedas, hacia arriba y hacia abajo, 10 veces."
    }
  },
  {
    pregunta: "¿Qué preferís...\nVerano o Invierno?",
    opciones: [
      { texto: "Verano",   emoji: "☀️", color: "#f5b041" },
      { texto: "Invierno", emoji: "❄️", color: "#85c1e9" }
    ],
    ejercicio: {
      titulo: "Chasquea la lengua!",
      explicacion: "¿Cómo se hace? Pega la lengua arriba en el paladar y hazla sonar hacia abajo, como un caballito. Hazlo 10 veces."
    }
  }
];

//elementos importados del html
const ejercicio = document.getElementById('ejercicio');           // el cuadro grande
const flechaIntro = document.getElementById('flechaIntro');      
const flechaEjercicio = document.getElementById('flechaEjercicio'); 
const textoPregunta = document.getElementById('textoPregunta');
const tituloOpcion = document.getElementById('tituloOpcion');
const tituloEjercicio = document.getElementById('tituloEjercicio');
const explicacionEjercicio = document.getElementById('explicacionEjercicio');

// los botones de opciones, botones[0] es el A y botones[1] el B
const botones = [
  document.getElementById('opcionA'),
  document.getElementById('opcionB')
];

//  MEZCLAR LAS PREGUNTAS       
//IMPORTANTE intentar usar la funcion que hace que se reste el valor que aparecio (sar random y restarlo para que no este mas el numero que aparecio)
// Fisher-Yates: forma de mezclar una lista donde aparece UNA sola vez (nunca se repite una pregunta)
function mezclar(lista) {
  const copia = [...lista];                       // usa una copia para poder modificar y cambiar el orden de la original (de los ejercicios)
  for (let i = copia.length - 1; i > 0; i--) {     //así se recorre la lista desde el final hasta el principio para ir cambiando de lugar cada elemento con otro al azar
    const j = Math.floor(Math.random() * (i + 1)); // posición al azar entre 0 e i
    [copia[i], copia[j]] = [copia[j], copia[i]];   // intercambia las dos posiciones, esa posición queda "congelada" y el bucle pasa a la siguiente (i--). Esto garantiza que no haya duplicados ni repeticiones
  }
  return copia;
}

const orden = mezclar(preguntas); // se mezcla cada vez que se juega
let indice = 0;                   // dice qué pregunta toca ahora definiendo la primera pregunta como la 0, la segunda como la 1, etc. 



//  CAMBIAR DE PANTALLA 
// Le pone al cuadro grande la clase de la pantalla que queremos ver: el CSS se encarga
function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
  ejercicio.style.backgroundColor = ''; // borra el color que pusó el JS y vuelve al predeterminado
}

//  PANTALLA DE PREGUNTA 
function mostrarPregunta() {
  const p = orden[indice];              // la pregunta que toca ahora (viene de la otra funcion) ahora se va a llamar p
  textoPregunta.textContent = p.pregunta; //textoPregunta viene del html y va a cambiar lo que dice con textContent segun p

  botones.forEach((boton, i) => {
    const op = p.opciones[i];
    boton.querySelector('.op-texto').textContent = op.texto;
    boton.querySelector('.op-emoji').textContent = op.emoji;
    boton.style.backgroundColor = op.color;
  });

  mostrarModo('modo-pregunta');
}

// ================== PANTALLA DE EJERCICIO ==================
// "numero" es 0 si tocó el botón A, 1 si tocó el B
function elegir(numero) {
  const p = orden[indice];
  const op = p.opciones[numero];        // la opción que eligió

  // arriba a la derecha: "🍕 Pizza!! 🍕"
  tituloOpcion.textContent = `${op.emoji} ${op.texto}!! ${op.emoji}`;

  // El ejercicio es el MISMO sin importar cuál opción tocó
  tituloEjercicio.textContent = p.ejercicio.titulo;
  explicacionEjercicio.textContent = p.ejercicio.explicacion;

  mostrarModo('modo-ejercicio');
  // el cuadro se pinta del color de la opción elegida
  // (va DESPUÉS de mostrarModo porque esa función borra el color)
  ejercicio.style.backgroundColor = op.color;
}

// ================== SEGUIR A LA PRÓXIMA PREGUNTA ==================
function siguiente() {
  indice++;                              // pasa a la pregunta siguiente
  if (indice >= orden.length) {
    mostrarModo('modo-final');           // ya respondió las 5
    // window.location.href = '../principal/pantalla-atras.html'; // si querés redirigir al terminar
  } else {
    mostrarPregunta();
  }
}

// ================== EVENTOS (qué pasa al tocar cada cosa) ==================
flechaIntro.addEventListener('click', mostrarPregunta);   // la flecha de la explicación empieza el juego
flechaEjercicio.addEventListener('click', siguiente);     // la flecha del ejercicio sigue a la próxima pregunta
botones[0].addEventListener('click', () => elegir(0));    // botón A
botones[1].addEventListener('click', () => elegir(1));    // botón B