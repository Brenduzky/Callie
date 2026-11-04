const URL_SERVER = 'http://localhost:3000';

let registrate = document.getElementById("registrate");
let botonSiguiente = document.querySelector(".siguiente");

botonSiguiente.addEventListener('click', async (event) => {
    event.preventDefault();

    // 1. Obtener valores de los campos
    const nombre = registrate["nombre-usuario"]?.value.trim();
    const pass = registrate["contraseña"]?.value || registrate["contrasena"]?.value;
    const confirmPass = registrate["verificacion"]?.value;
    const fechaNacimiento = registrate["nacimiento"]?.value;

    if (!nombre || !pass || !fechaNacimiento) {
        alert("Por favor completá todos los campos requeridos.");
        return;
    }

    // 2. Validar contraseñas
    if (pass !== confirmPass) {
        alert("Verificación fallida: las contraseñas no coinciden.");
        return;
    }

    // 3. Obtener el problema fonoaudiológico seleccionado
    let problemaSeleccionado = document.querySelector('input[name="opcion"]:checked');

    if (!problemaSeleccionado) {
        alert("Tenés que seleccionar un obstáculo fonoaudiológico");
        return;
    }

    // 4. Armar el payload para el backend
    let user = {
        nombre: nombre,
        contrasena: pass,
        fechaDeNacimiento: fechaNacimiento,
        // OJO: Si tu tipo 'problemaFonoaudiologico' es un objeto, parsealo según cómo lo espere tu backend:
        problemaFonoaudiologico: (problemaSeleccionado.value)
        // Si tu backend espera directamente un string/número, usá: problemaSeleccionado.value
    };

    try {
        const respuesta = await fetch(`${URL_SERVER}/usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.funciono) {
            alert("¡Registro exitoso!");
            console.log("Usuario registrado:", resultado.usuario);
            
            // Guardamos sesión igual que en el login
            if (resultado.usuario) {
                localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            }

            window.location.href = '../principal/pantalla-atras.html';
        } else {
            alert("Error al registrarse: " + (resultado.mensaje || "Ocurrió un problema"));
        }

    } catch (error) {
        console.error("Error de conexión con el servidor:", error);
        alert("No se pudo conectar con el servidor.");
    }
});