//elementos del html
const elementoRacha = document.getElementById('cuanto-racha');
const elementoPeces = document.getElementById('cuantos-peces');

// para poder agarrar lo q hizo sharona
async function cargarDatosUsuario() {
    try {
        const respuesta = await fetch('https://api.tu-servidor.com/datos-usuario'); // reemplazar el endpoint por el real de sharin
        
        //lo convertimos a JSON
        const datos = await respuesta.json();
        
        // como esta como { "diasRacha": 14, "cantidadPeces": 5000 }
        // voy a pasarlos a donde deberian estar
        if (datos.diasRacha !== undefined) {
            elementoRacha.textContent = datos.diasRacha;
        }
        
        if (datos.cantidadPeces !== undefined) {
            // Se usa toLocaleString() para pasar 20000 a 20.000 (ej)
            elementoPeces.textContent = datos.cantidadPeces.toLocaleString();
        }

    } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
        // Mostrar esto si falla la conexión
        elementoRacha.textContent = '666';
        elementoPeces.textContent = '666';
    }
}

// para q funcione esto apenas se abre la pagina
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);