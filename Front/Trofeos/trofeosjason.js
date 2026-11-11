const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', Trofeos);

function obtenerIdUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    } catch (error) {
        return null;
    }
}

const id = obtenerIdUsuario();

async function Trofeos() {
    // Si no hay usuario guardado, vuelve al inicio de sesión (igual que en los juegos)
    if (id === null || id === undefined) {
        window.location.href = '../IniciarSesion/Iniciosesion.html';
        return;
    }

    try {
        // Pide al servidor los trofeos del usuario
        const resultado = await fetch(`${URL_SERVER}/usuario/${id}/trofeos`);
        const respuesta = await resultado.json();

        // Si el servidor dice que algo falló, lo mostramos y cortamos
        if (!respuesta.funciono) {
            console.error(respuesta.mensaje);
            return;
        }

        // Recorre cada trofeo que mandó el servidor
        respuesta.trofeos.forEach(trofeo => {
            // Busca la tarjeta del HTML cuyo data-id coincide con el id del trofeo
            const tarjeta = document.querySelector('.untrofeo[data-id="' + trofeo.idDelTrofeo + '"]');

            // Si no hay tarjeta para ese trofeo, pasa al siguiente
            if (!tarjeta) return;

            if (trofeo.desbloqueado) {
                tarjeta.style.backgroundColor = "#83EB96"; // desbloqueado: verde
                tarjeta.classList.remove('bloqueado');
            } else {
                tarjeta.classList.add('bloqueado');        // bloqueado: se le puede dar estilo en el CSS
            }
        });
    } catch (error) {
        // Si el servidor está apagado o hay un error de conexión
        console.error('No se pudieron cargar los trofeos:', error);
    }
}