const preguntas = [ //todas las preguntas con sus ejercicios
  {
    pregunta: "¿Qué preferís...\nPizza o Hamburguesa?", //el \n es un salto de línea, para que quede en dos renglones
    opciones: [
      { texto: "Pizza",       imagen: "../../imagenes/segundo-pizza.png", color: "#e97f7f" },
      { texto: "Hamburguesa", imagen: "../../imagenes/segundo-hamburguesa.png", color: "#e2ec55" }
    ],
    
    ejercicio: {
      titulo: "Debes hacer 10 besos!",
      explicacion: "¿Cómo se hace? Cierra la boca y empuja tus labios hacia adelante y arriba, sin separarlos. Mantenlo así por 10 segundos."
    }
  },
  {
    pregunta: "¿Qué preferís...\nPerro o Gato?",
    opciones: [
      { texto: "Perro", imagen:"../../imagenes/segundo-perro.png", color: "#E8C075" },
      { texto: "Gato",  imagen:"../../imagenes/segundo-gato.png", color: "#ABB1A6" }
    ],
    ejercicio: {
      titulo: "Infla las mejillas!",
      explicacion: "¿Cómo se hace? Llena tus mejillas de aire como un globo y mantenlo 5 segundos. Repítelo 3 veces."
    }
  },
  {
    pregunta: "¿Qué preferís...\n \u00A0\u00A0\u00A0\u00A0 Playa o Montaña?",   //\u00A0 hace que haya espacio vacio asi se ve mas al costado :)
    opciones: [
      { texto: "Playa",   imagen :"../../imagenes/segundo-playa.png", color: "#F2D2A8" },
      { texto: "Montaña", imagen:"../../imagenes/segundo-montaña.png", color: "#99E556" }
    ],
    ejercicio: {
      titulo: "Sonrisa gigante!",
      explicacion: "¿Cómo se hace? Sonríe lo más grande que puedas sin abrir la boca y mantenlo 10 segundos."
    }
  },
  {
    pregunta: "¿Qué preferís...\nAvión o Barco?",
    opciones: [
      { texto: "Avion",  imagen: "../../imagenes/segundo-avion.png", color: "#C3DDF2" },
      { texto: "Barco", imagen: "../../imagenes/segundo-barco.png", color: "#8880F5" }
    ],
    ejercicio: {
      titulo: "Saca la lengua!",
      explicacion: "¿Cómo se hace? Saca la lengua lo más que puedas, hacia arriba y hacia abajo, 10 veces."
    }
  },
  {
    pregunta: "¿Qué preferís...\nHelado o Chocolate?",
    opciones: [
      { texto: "Helado",   imagen: "../../imagenes/segundo-helado.png", color: "#F29CF0" },
      { texto: "Chocolate", imagen: "../../imagenes/segundo-chocolate.png", color: "#BA816E" }
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
const jugarOtraVez = document.getElementById('jugarOtraVez');

// los botones de opciones, botones[0] es el A y botones[1] el B
const botones = [
  document.getElementById('opcionA'),
  document.getElementById('opcionB')
];

//  MEZCLAR LAS PREGUNTAS
// Elige una pregunta al azar, la saca de la lista y la pone en el nuevo orden. Se repite hasta que no queda ninguna
function mezclar(lista) {
  const restantes = [...lista];   // usa una copia para poder modificar y cambiar el orden (de los ejercicios)
  const resultado = [];           

  while (restantes.length > 0) {           // preguntas sin usar
    const i = Math.floor(Math.random() * restantes.length); // al azar de las q quedan
    const elegida = restantes.splice(i, 1)[0];              // la elegida la usa y la saca de "restantes" 
    resultado.push(elegida);                                // la usa
  }

  return resultado;
}

const orden = mezclar(preguntas); // se mezcla cada vez que se juega
let indice = 0;                   // dice qué pregunta toca ahora (la primera es la 0, la segunda la 1, etc.)


//  CAMBIAR DE PANTALLA 
// Le pone al cuadro grande la clase de la pantalla que queremos ver: el CSS se encarga
function mostrarModo(modo) {
  ejercicio.className = 'ejercicio ' + modo;
  ejercicio.style.backgroundColor = ''; // borra el color que pusó el JS y vuelve al predeterminado
}

//  PANTALLA DE PREGUNTA 
function mostrarPregunta() {
  const p = orden[indice];              // la pregunta que toca ahora (viene de la ultima funcion) ahora se va a llamar p
  textoPregunta.textContent = p.pregunta; //textoPregunta viene del html y va a cambiar lo que dice con textContent segun p

  botones.forEach((boton, i) => {              //botones viene del httml
    const op = p.opciones[i];       //Obtiene la opción correspondiente a ese botón usando i
    boton.querySelector('.op-texto').textContent = op.texto;   //querySelector busca la etiqueta que muestra el icono y le pone op.texto
    boton.querySelector('.op-img').src = op.imagen;
    boton.style.backgroundColor = op.color; //segun op.color le pone el color al cuadrado grande
  });

  mostrarModo('modo-pregunta');
}

//  PANTALLA DE EJERCICIO 
function elegir(numero) {   // "numero" es 0 si tocó el botón A, 1 si tocó el B
  const p = orden[indice];     //le pone p en la pregunta que se encuentra que luego mostrara el ejercicio predeterminado para la misma
  const op = p.opciones[numero];        // la opción que eligió

  // lo quqe se muestra arriba a la derecha
  tituloOpcion.innerHTML = `
  <img class="titulo-img derecha" src="${op.imagen}" alt="">
  ${op.texto}!!
  <img class="titulo-img " src="${op.imagen}" alt="">
`;


  // El ejercicio es el mismo sin importar que opcion elijió
  tituloEjercicio.textContent = p.ejercicio.titulo;
  explicacionEjercicio.textContent = p.ejercicio.explicacion;

  mostrarModo('modo-ejercicio');
  // el cuadro se pinta del color de la opción elegida (despues de mostrarModo porque esa función borra el color)
  ejercicio.style.backgroundColor = op.color;
}

//  SEGUIR A LA PRÓXIMA PREGUNTA 
function siguiente() {
  indice++;                             
  if (indice >= orden.length) {
    mostrarModo('modo-final');           // cuando ya respondió las 5
    // window.location.href = '../principal/pantalla-atras.html'; // redirigir al terminar
  } else {
    mostrarPregunta();
  }
}

//  Que pasa cuando se toca algo
flechaIntro.addEventListener('click', mostrarPregunta);   // flecha de la explicación (empieza el juego)
flechaEjercicio.addEventListener('click', siguiente);     // flecha del ejercicio (sigue a la próxima pregunta)
botones[0].addEventListener('click', () => elegir(0));    // A = 0
botones[1].addEventListener('click', () => elegir(1));    // B = 0

jugarOtraVez.addEventListener('click', () => location.reload()); // recargar hace q se reinicie


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