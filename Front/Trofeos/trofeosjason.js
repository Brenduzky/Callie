const URL_SERVER = 'http://localhost:3000';
const contenedor = document.querySelector(".medio")
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
const tarjetas = document.querySelectorAll('.untrofeo');

async function Trofeos(){
    const resultado = await fetch (URL_SERVER + '/usuario/' + id +  '/trofeos', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    const respuesta = await resultado.json()
    respuesta.trofeos.forEach(trofeo => {
        // Muestra cada trofeo y si está desbloqueado
        console.log('trofeo:', trofeo.idDelTrofeo, 'desbloqueado:', trofeo.desbloqueado)

        if (trofeo.desbloqueado) {
            const tarjeta = document.querySelector('.untrofeo[data-id="' + trofeo.idDelTrofeo + '"]')

            // Muestra si encontró la tarjeta (null = no la encontró)
            console.log('tarjeta encontrada:', tarjeta)

            if (tarjeta) {
                tarjeta.style.backgroundColor = "#83EB96"
            }
        }
    })
    

}

/*async function cargarTrofeos() {

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
} */