const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 2; // id de este juego en tu base de datos

function obtenerIdUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? usuario.id : null;
  } catch (error) {
    return null;
  }
}

const preguntas = [ //todas las preguntas con sus ejercicios
  {
    pregunta: "¿Qué preferís...\n Pizza o Hamburguesa?", //el \n es un salto de línea, para que quede en dos renglones
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
      { texto: "Perro", imagen:"../../imagenes/segundo-perro.png", color: "#E8C075" },
      { texto: "Gato",  imagen:"../../imagenes/segundo-gato.png", color: "#ABB1A6" }
    ],
    ejercicio: {
      titulo: "¡Sonreí enseñando los dientes 10 veces!",
      explicacion: "¿Cómo se hace? \n 1. Hacé una sonrisa bien grande mostrando los dientes. \n 2. Mantené la sonrisa por 10 segundos. \n 3. Relajá la boca y repetí."
    }
  },
  {
    pregunta: "¿Qué preferís...\n  Playa o Montaña?",   //\u00A0 hace que haya espacio vacio asi se ve mas al costado :)
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
  explicacionEjercicio.innerHTML = p.ejercicio.explicacion.replace(/\n/g, '<br>');

  mostrarModo('modo-ejercicio');
  // el cuadro se pinta del color de la opción elegida (despues de mostrarModo porque esa función borra el color)
  ejercicio.style.backgroundColor = op.color;
}

//  SEGUIR A LA PRÓXIMA PREGUNTA 
let resultadoEnviado = false; // evita sumar los peces dos veces

function siguiente() {
  indice++;
  if (indice >= orden.length) {
    mostrarModo('modo-final');   // cuando ya respondió las 5
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