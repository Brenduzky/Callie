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

    // 2. Carga de datos del usuario
    cargarDatosUsuario();
});

async function cargarDatosUsuario() {
    const elementoRacha = document.getElementById('cuanto-racha');
    const elementoPeces = document.getElementById('cuantos-peces');

    try {
        const respuesta = await fetch('https://api.tu-servidor.com/datos-usuario');
        const datos = await respuesta.json();
        
        if (datos.diasRacha !== undefined && elementoRacha) {
            elementoRacha.textContent = datos.diasRacha;
        }
        
        if (datos.cantidadPeces !== undefined && elementoPeces) {
            elementoPeces.textContent = datos.cantidadPeces.toLocaleString();
        }
    } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
        if (elementoRacha) elementoRacha.textContent = '0';
        if (elementoPeces) elementoPeces.textContent = '0';
    }
}