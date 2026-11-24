const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const btnConfig = document.getElementById('btn-config');
    const popoutMenu = document.getElementById('popout-menu');

    if (btnConfig && popoutMenu) {
        btnConfig.addEventListener('click', (e) => {
            e.stopPropagation();
            popoutMenu.classList.toggle('oculto');
        });

        document.addEventListener('click', (e) => {
            if (!popoutMenu.contains(e.target) && !btnConfig.contains(e.target)) {
                popoutMenu.classList.add('oculto');
            }
        });
    }

    const btnLogout = document.querySelector('.btn-logout-link');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuario');
        });
    }

    cargarDatosUsuario();
});

function obtenerIdUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? usuario.id : null;
}

async function cargarDatosUsuario() {
    const elementoRacha = document.getElementById('cuanto-racha');
    const elementoPeces = document.getElementById('cuantos-peces');

    const id = obtenerIdUsuario();

    if (id === null || id === undefined) {
        window.location.href = '../IniciarSesion/Iniciosesion.html';
        return;
    }

    const [respuestaUsuario, respuestaRacha] = await Promise.all([
        fetch(`${URL_SERVER}/usuario/${id}`),
        fetch(`${URL_SERVER}/usuario/${id}/racha`)
    ]);

    const datosUsuario = await respuestaUsuario.json();
    const datosRacha = await respuestaRacha.json();

    if (datosUsuario.funciono && datosUsuario.usuario && elementoPeces) {
        const peces = datosUsuario.usuario.monedas
            ?? datosUsuario.usuario.monedasDisponibles
            ?? 0;
        elementoPeces.textContent = peces.toLocaleString();
    }

    if (datosRacha.funciono && elementoRacha) {
        elementoRacha.textContent = datosRacha.racha ?? 0;
    }
}