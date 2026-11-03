const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', cargarTrofeos);

function obtenerIdUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    } catch (error) {
        return null;
    }
}

async function cargarTrofeos() {
    const id = obtenerIdUsuario();

    if (id === null || id === undefined) {
        window.location.href = '../IniciarSesion/Iniciosesion.html';
        return;
    }

    const tarjetas = document.querySelectorAll('.untrofeo');

    try {
        const respuesta = await fetch(`${URL_SERVER}/usuario/${id}/trofeos`);
        const datos = await respuesta.json();

        if (!datos.funciono) {
            console.error(datos.mensaje);
            return;
        }

        // Ids de los trofeos que el usuario ya ganó
        const ganados = new Set(
            datos.trofeos
                .filter((t) => t.obtenido !== false)
                .map((t) => String(t.id ?? t.idTrofeo))
        );

        tarjetas.forEach((tarjeta) => {
            if (!ganados.has(tarjeta.dataset.id)) {
                tarjeta.classList.add('bloqueado');
            }
        });
    } catch (error) {
        console.error('Error al obtener los trofeos:', error);
    }
}