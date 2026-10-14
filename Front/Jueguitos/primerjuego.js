const TOTAL = 6; // cajas a tocar antes de terminar

const cajas = document.querySelectorAll('.seleccion');
const ejercicio = document.getElementById('ejercicio');
const callie = document.getElementById('callie');
const burbuja = document.getElementById('burbujadetexto');
const texto = document.getElementById('texto');
const flecha = document.getElementById('flecha');
const cerrar = document.getElementById('cerrar');

// Textos distintos para cada caja (uno al azar)
const textos = {
    primero: [
        '¡Mmm, bebesita, que ricos labios rojitos.',
        'Los labios sirven para sonreír. ¡Probá sonreír!',
        'Dicen que los pingüinos también mandan besos.'
    ],
    segundo: [
        '¡Brrr! Qué frío, es puro hielo.',
        'Este cubito se derrite si lo dejás al sol.',
        'En mi iglú hay hielo por todos lados.'
    ],
    tercero: [
        '¡Amarillo como el sol! Aunque acá casi no sale.',
        'Me encanta este color, ¡brilla mucho!',
        'Las cajas amarillas dan buena suerte.'
    ],
    cuarto: [
        '¡Verde como el pasto! Lo extraño un montón.',
        'Esta caja es la más fresca de todas.',
        '¡Verde fluor! Se ve desde lejos.'
    ]
};

let rondas = 0;
let activa = null;
let ultima = null;
let bloqueado = false;

function azar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function iluminar() {
    // elige una caja al azar, sin repetir la anterior
    const opciones = [...cajas].filter(c => c !== ultima);
    activa = azar(opciones);
    activa.classList.add('brilla');
}

function tocarCaja(caja) {
    if (bloqueado) return; // Si está en pausa tras un error, ignora clics

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

    // imagen (si tiene data-img) o color en el cuadro grande
    ejercicio.textContent = '';
    if (caja.dataset.img) {
        ejercicio.style.backgroundImage = `url('${caja.dataset.img}')`;
    } else {
        ejercicio.style.backgroundImage = 'none';
    }
    ejercicio.style.backgroundColor = caja.dataset.color;

    // Callie se agranda y habla
    texto.textContent = azar(textos[caja.id]);
    callie.classList.add('grande');
    burbuja.classList.add('abierta');
}

function terminar() {
    ejercicio.style.backgroundImage = 'none';
    ejercicio.style.backgroundColor = '#f1f0ee';
    ejercicio.textContent = '¡Lo habeis logrado chaval!! Terminaste! 🎉';
    // Acá podés redirigir a la siguiente pantalla, por ejemplo:
    // window.location.href = 'siguiente.html';
}

function tocarFlecha() {
    // la burbuja se achica y Callie vuelve a su tamaño chico
    burbuja.classList.remove('abierta');
    callie.classList.remove('grande');

    if (rondas >= TOTAL) {
        terminar();
    } else {
        setTimeout(iluminar, 500);
    }
}

cajas.forEach(caja => caja.addEventListener('click', () => tocarCaja(caja)));
flecha.addEventListener('click', tocarFlecha);
cerrar.addEventListener('click', () => window.history.back());

iluminar();