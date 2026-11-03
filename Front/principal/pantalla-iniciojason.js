const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del Popout de Configuración
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

    // 2. Cerrar sesión: borra el usuario guardado en el login
    const btnLogout = document.querySelector('.btn-logout-link');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuario');
        });
    }

    // 3. Carga de datos del usuario
    cargarDatosUsuario();
});

function obtenerIdUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    } catch (error) {
        return null;
    }
}

async function cargarDatosUsuario() {
    const elementoRacha = document.getElementById('cuanto-racha');
    const elementoPeces = document.getElementById('cuantos-peces');

    const id = obtenerIdUsuario();

    // Si no hay sesión iniciada, volvemos al login
    if (id === null || id === undefined) {
        window.location.href = '../IniciarSesion/Iniciosesion.html';
        return;
    }

    try {
        // Las dos consultas salen juntas
        const [respuestaUsuario, respuestaRacha] = await Promise.all([
            fetch(`${URL_SERVER}/usuario/${id}`),
            fetch(`${URL_SERVER}/usuario/${id}/racha`)
        ]);

        const datosUsuario = await respuestaUsuario.json();
        const datosRacha = await respuestaRacha.json();

        // Peces (en el server son las monedas)
        if (datosUsuario.funciono && datosUsuario.usuario && elementoPeces) {
            const peces = datosUsuario.usuario.monedas
                ?? datosUsuario.usuario.monedasDisponibles
                ?? 0;
            elementoPeces.textContent = peces.toLocaleString();
        }

        // Racha (fueguito)
        if (datosRacha.funciono && elementoRacha) {
            elementoRacha.textContent = datosRacha.racha ?? 0;
        }
    } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
        if (elementoRacha) elementoRacha.textContent = '0';
        if (elementoPeces) elementoPeces.textContent = '0';
    }
}