const URL_SERVER = 'http://localhost:3000';

let registrate = document.getElementById("registrate");
let botonSiguiente = document.querySelector(".siguiente");

botonSiguiente.addEventListener('click', async (event) => {
    event.preventDefault();


    const nombre = registrate["nombre-usuario"]?.value.trim();
    const pass = registrate["contraseña"]?.value || registrate["contrasena"]?.value;
    const confirmPass = registrate["verificacion"]?.value;
    const fechaNacimiento = registrate["nacimiento"]?.value;

    if (pass !== confirmPass) {
        alert("Verificación fallida: las contraseñas no coinciden.");
        return;
    }

  
    let problemaSeleccionado = document.querySelector('input[name="opcion"]:checked');

    if (!problemaSeleccionado) {
        alert("Tenés que seleccionar un obstáculo fonoaudiológico");
        return;
    }


    let user = {
        nombre: nombre,
        contrasena: pass,
        fechaDeNacimiento: fechaNacimiento,
        problemaFonoaudiologico: (problemaSeleccionado.value)
    };



    
        const respuesta = await fetch(`${URL_SERVER}/usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });


        const resultado = await respuesta.json();



        if (respuesta.ok && resultado.funciono) {
            alert("Registro exitoso");
            console.log("Usuario registrado:", resultado.usuario);
            
            if (resultado.usuario) {
                localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            }

            window.location.href = '../principal/pantalla-atras.html';
        } else {
            alert("Error al registrarse: " + (resultado.mensaje || "Ocurrió un problema"));
        }

});