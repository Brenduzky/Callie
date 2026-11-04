const URL_SERVER = 'http://localhost:3000';

const inputNombre = document.getElementById("nombre-usuario") || document.querySelector('input[name="nombre-usuario"]');
const inputFecha = document.getElementById("nacimiento") || document.querySelector('input[name="nacimiento"]');
const inputContra = document.getElementById("contraseña") || document.querySelector('input[name="contraseña"]');
const inputVerif = document.getElementById("verificacion") || document.querySelector('input[name="verificacion"]');
const boton = document.getElementById("boton");

let usuarioActual = null;

// Cargar los datos guardados apenas abre la pantalla
document.addEventListener('DOMContentLoaded', () => {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
        console.warn("No hay datos de usuario almacenados en localStorage.");
        return;
    }

    usuarioActual = JSON.parse(usuarioGuardado);
    console.log("Usuario cargado desde localStorage:", usuarioActual);

    // 1. Mostrar el nombre guardado en el placeholder
    const nombreGuardado = usuarioActual.nombre || usuarioActual.nombreDeUsuario;
    if (inputNombre && nombreGuardado) {
        inputNombre.placeholder = nombreGuardado;
    }

    // 2. Cargar la fecha de nacimiento guardada
    if (inputFecha && usuarioActual.fechaDeNacimiento) {
        inputFecha.value = usuarioActual.fechaDeNacimiento;
    }

    // 3. Marcar el problema fonoaudiológico si existía uno
    if (usuarioActual.problemaFonoaudiologico) {
        const idProblema = usuarioActual.problemaFonoaudiologico.id ?? usuarioActual.problemaFonoaudiologico;
        const radio = document.querySelector(`input[name="opcion"][value="${idProblema}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
});

// Guardar los cambios realizados
async function Registrarse() {
    if (!usuarioActual || !usuarioActual.id) {
        alert("No se encontró el ID del usuario para modificar.");
        return;
    }

    const nombreGuardado = usuarioActual.nombre || usuarioActual.nombreDeUsuario;
    let nombre = inputNombre.value.trim() || nombreGuardado;
    let contra = inputContra.value;
    let confirmacion = inputVerif.value;
    let fechaNacimiento = inputFecha.value || usuarioActual.fechaDeNacimiento;

    if (contra.length > 0 && contra !== confirmacion) {
        alert("Verificación fallida: las contraseñas no coinciden.");
        return;
    }

    let problemaSeleccionado = document.querySelector('input[name="opcion"]:checked');
    if (!problemaSeleccionado) {
        alert("Tenés que seleccionar un obstáculo fonoaudiológico.");
        return;
    }

    let user = {
        nombre: nombre,
        fechaDeNacimiento: fechaNacimiento,
        problemaFonoaudiologico: {
            id: Number(problemaSeleccionado.value)
        }
    };

    if (contra.length > 0) {
        user.contrasena = contra;
    }

    try {
        const respuesta = await fetch(`${URL_SERVER}/usuario/${usuarioActual.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.funciono) {
            alert("¡Modificación exitosa!");
            if (resultado.usuario) {
                localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            }
            window.location.href = '../principal/pantalla-atras.html';
        } else {
            alert("Error: " + (resultado.mensaje || "No se pudo actualizar el usuario"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

boton.addEventListener('click', (event) => {
    event.preventDefault();
    Registrarse();
});