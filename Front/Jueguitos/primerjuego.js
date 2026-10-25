const TOTAL = 6; // veces q pasa para terminar

//elementos que va a utilizar del html
const cajas = document.querySelectorAll('.seleccion');
const ejercicio = document.getElementById('ejercicio');
const titulo = document.getElementById('titulo');
const explicacion = document.getElementById('explicacion');
const flechaIntro = document.getElementById('flecha');      
const flechaConsigna = document.getElementById('flecha2');  
const cerrar = document.getElementById('cerrar');

let rondas = 0;
let activa = null;
let ultima = null;
let bloqueado = true;// Empieza en true: mientras Callie explica el juego, las cajas de abajo no hacen nada

function azar(lista) {
    return lista[Math.floor(Math.random() * lista.length)]; //va entre las opciones para elegir una random
}

function iluminar() { //define una funcion que va a hacer q dsp voy a hacer q se ilumine una de las cajas
    const opciones = [...cajas].filter(c => c !== ultima); 
    activa = azar(opciones);
    activa.classList.add('brilla');
    bloqueado = false; // ahora sí se puede tocar
}

// Cuando se cierra la Flecha de la burbuja de Callie se cierra la explicación y empieza el juego
function empezar() {
    vaciar();                  // el cuadro grande queda vacío
    setTimeout(iluminar, 500); // espera un rato y ilumina la primera caja
}

// Deja el cuadro grande en su estado de inicio
function vaciar() {
    ejercicio.classList.remove('modo-intro', 'modo-consigna');
    ejercicio.style.backgroundColor = ''; // borra el color que puso el JS, así vuelve al gris del CSS
}

function tocarCaja(caja) {
    if (bloqueado) return; // Si está en intro, error o consigna abierta, ignora clics

    // Si toca la caja q no es se pone rojo
    if (caja !== activa) {
        bloqueado = true;
        caja.classList.add('error-rojo');

        setTimeout(() => {
            caja.classList.remove('error-rojo');
            bloqueado = false;
        }, 1000); // (1000 ms = 1 segundo)

        return;
    }

    // Si toca la caja q si sigue al siguiente
    caja.classList.remove('brilla');
    ultima = caja;
    activa = null;
    rondas++;
    bloqueado = true; // mientras se ve la consigna no se puede tocar otra caja

    // dataset.titulo lee data-titulo que escribiste en el HTML para ponerlo
    titulo.textContent = caja.dataset.titulo;
    explicacion.textContent = caja.dataset.explicacion;

    // getComputedStyle(caja).backgroundColor hace que la pantalla se ponga del color que tiene la caja
    // así el cuadro grande queda del MISMO color sin repetirlo en el JS
    ejercicio.style.backgroundColor = getComputedStyle(caja).backgroundColor;

    // muestra la consigna adentro del cuadro grande
    ejercicio.classList.remove('modo-intro');
    ejercicio.classList.add('modo-consigna');
}

// si se toca la flecha del cuadro de la consigna se cierra y sigue el juego
function cerrarConsigna() {
    if (rondas >= TOTAL) {
        terminar();
    } else {
        vaciar();                  // el cuadro vuelve al gris de inicio sin nada
        setTimeout(iluminar, 500); // y se ilumina la siguiente caja
    }
}

function terminar() {
    ejercicio.style.backgroundColor = '';          // vuelve al gris
    ejercicio.classList.remove('modo-intro', 'modo-consigna');
    ejercicio.classList.add('modo-final');         // muestra a Callie y "Lo lograste!!!"
    bloqueado = true;                              // las cajas ya no hacen nada

    // window.location.href = '../../Front/principal/pantalla-atras.html'
}

cajas.forEach(caja => caja.addEventListener('click', () => tocarCaja(caja)));
flechaIntro.addEventListener('click', empezar);
flechaConsigna.addEventListener('click', cerrarConsigna);
cerrar.addEventListener('click', () => window.history.back());

//el juego arranca recién cuando se aprieta la flecha de la burbuja