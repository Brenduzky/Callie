const TOTAL = 6; // veces q pasa para terminar


const URL_SERVER = 'http://localhost:3000';
const ID_EJERCICIO = 1; 

function obtenerIdUsuario() {
   
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    } 



const cajas = document.querySelectorAll('.seleccion');
const ejercicio = document.getElementById('ejercicio');
const titulo = document.getElementById('titulo');
const explicacion = document.getElementById('explicacion');
const flechaIntro = document.getElementById('flecha');      
const flechaConsigna = document.getElementById('flecha2');  

let rondas = 0;
let activa = null;
let ultima = null;
let bloqueado = true;

function azar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function iluminar() { 
    const opciones = [...cajas].filter(c => c !== ultima); 
    activa = azar(opciones);
    activa.classList.add('brilla');
    bloqueado = false; 
}
function empezar() {
    vaciar();                 
    setTimeout(iluminar, 500); 
}

function vaciar() {
    ejercicio.classList.remove('modo-intro', 'modo-consigna');
    ejercicio.style.backgroundColor = ''; 
}

function tocarCaja(caja) {
    if (bloqueado) return; 

    
    if (caja !== activa) {
        bloqueado = true;
        caja.classList.add('error-rojo');

        setTimeout(() => {
            caja.classList.remove('error-rojo');
            bloqueado = false;
        }, 1000); 

        return;
    }

   
    caja.classList.remove('brilla');
    ultima = caja;
    activa = null;
    rondas++;
    bloqueado = true; 

    
    titulo.textContent = caja.dataset.titulo;
    explicacion.textContent = caja.dataset.explicacion;

    ejercicio.style.backgroundColor = getComputedStyle(caja).backgroundColor;

   
    ejercicio.classList.remove('modo-intro');
    ejercicio.classList.add('modo-consigna');
}

function cerrarConsigna() {
    if (rondas >= TOTAL) {
        terminar();
    } else {
        vaciar();                  
        setTimeout(iluminar, 500); 
    }
}

let resultadoEnviado = false; 

function terminar() {
    ejercicio.style.backgroundColor = '';         
    ejercicio.classList.remove('modo-intro', 'modo-consigna');
    ejercicio.classList.add('modo-final');         
    bloqueado = true;                              

    enviarResultado();
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

       
        const pecesGanados = document.getElementById('pecesGanados');
        if (pecesGanados && datos.monedasGanadas !== undefined) {
            pecesGanados.textContent = datos.monedasGanadas;
        }

        
    } catch (error) {
        console.error('No se pudo enviar el resultado al servidor:', error);
        resultadoEnviado = false;
    }
}

cajas.forEach(caja => caja.addEventListener('click', () => tocarCaja(caja)));
flechaIntro.addEventListener('click', empezar);
flechaConsigna.addEventListener('click', cerrarConsigna);






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

const jugarOtraVez = document.getElementById('jugarOtraVez');
jugarOtraVez.addEventListener('click', () => location.reload());