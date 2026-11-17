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
            // Ponemos las imágenes que corresponden (color o gris)
            cambiarImagen(tarjeta, trofeo.desbloqueado);

            if (trofeo.desbloqueado) {
                tarjeta.style.backgroundColor = "#83EB96"; // desbloqueado: verde
                tarjeta.classList.remove('bloqueado');
            } else {
                tarjeta.classList.add('bloqueado');
            }
        });
    } catch (error) {
        // Si el servidor está apagado o hay un error de conexión
        console.error('No se pudieron cargar los trofeos:', error);
    } finally {
        // Pase lo que pase, mostramos las imágenes (ya están con su versión correcta)
        document.querySelector('.medio').classList.add('cargado');
    }

}

// Cambia las imágenes de una tarjeta: color si está desbloqueado, gris si no
function cambiarImagen(tarjeta, desbloqueado) {
    // Una tarjeta tiene 2 imágenes (izquierda y derecha), las recorremos a las dos
    tarjeta.querySelectorAll('img').forEach(img => {
        // La primera vez guardamos el src original (el de color) para no perderlo
        if (!img.dataset.color) {
            img.dataset.color = img.getAttribute('src');
        }

        // Armamos el nombre de la imagen gris: "trofeo-rayo.png" -> "trofeo-rayo-gris.png"
        const gris = img.dataset.color.replace('.png', '-gris.png');

        // Si lo tiene, imagen de color; si no, imagen gris
        img.src = desbloqueado ? img.dataset.color : gris;
    });
}