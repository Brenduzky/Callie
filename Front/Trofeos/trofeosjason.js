const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', Trofeos);

function obtenerIdUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? usuario.id : null;
}

const id = obtenerIdUsuario();

async function Trofeos() {
    if (id === null || id === undefined) {
        window.location.href = '../IniciarSesion/Iniciosesion.html';
        return;
    }

    const resultado = await fetch(`${URL_SERVER}/usuario/${id}/trofeos`);
    const respuesta = await resultado.json();

    if (!respuesta.funciono) {
        console.error(respuesta.mensaje);
        document.querySelector('.medio').classList.add('cargado');
        return;
    }

    respuesta.trofeos.forEach(trofeo => {
        const tarjeta = document.querySelector('.untrofeo[data-id="' + trofeo.condicion + '"]');

        if (!tarjeta) return;
        cambiarImagen(tarjeta, trofeo.desbloqueado);

        if (trofeo.desbloqueado) {
            tarjeta.style.backgroundColor = "#83EB96";
            tarjeta.style.borderColor = "#58976D";
            tarjeta.classList.remove('bloqueado');
        } else {
            tarjeta.classList.add('bloqueado');
        }
    });

    document.querySelector('.medio').classList.add('cargado');
}

function cambiarImagen(tarjeta, desbloqueado) {
    tarjeta.querySelectorAll('img').forEach(img => {
        if (!img.dataset.color) {
            img.dataset.color = img.getAttribute('src');
        }

        const gris = img.dataset.color.replace('.png', '-gris.png');

        img.src = desbloqueado ? img.dataset.color : gris;
    });
}