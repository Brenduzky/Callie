let registrate = document.getElementById("registrate");
let botonSiguiente = document.querySelector(".siguiente"); // Apuntamos al botón Siguiente

botonSiguiente.addEventListener('click', async (event) => {
    event.preventDefault();

    // 1. Validar contraseñas
    let pass = registrate.contraseña.value;
    let confirmPass = registrate.verificacion.value;

    if (pass !== confirmPass) {
        alert("Verificación fallida: las contraseñas no coinciden.");
        return; // Detenemos la ejecución si fallan
    }

   // 2. Obtener el problema fonoaudiológico seleccionado
    let problemaSeleccionado = document.querySelector('input[name="opcion"]:checked');

    if (problemaSeleccionado === null) {
    alert("Tenés que seleccionar un obstáculo fonoaudiológico");
    return;
    }

    
    // 3. Armar el objeto que espera el backend (según tu tipo Partial en Express)
    let user = {
        nombre: registrate["nombre-usuario"].value,
        contrasena: pass,
        fechaDeNacimiento: registrate.nacimiento.value,
        // Si tu backend espera un objeto o un array para el problema fonoaudiológico, 
        // mandamos el array de seleccionados:
        problemaFonoaudiologico: problemaSeleccionado.value
    };

    try {
        // 4. Enviar los datos al servidor Express (asegúrate de que el servidor esté corriendo)
        const respuesta = await fetch("http://localhost:3000/usuario", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const resultado = await respuesta.json();

        if (resultado.funciono) {
            alert("¡Registro exitoso!");
            console.log("Usuario registrado:", resultado.usuario);
            // Aquí puedes redirigirlo a otra ventana/página si quieres, ej:
            // window.location.href = "otra-pagina.html";
        } else {
            alert("Error al registrarse: " + resultado.mensaje);
        }

    } catch (error) {
        console.error("Error de conexión con el servidor:", error);
        alert("No se pudo conectar con el servidor. ¿Está encendido?");
    }
});