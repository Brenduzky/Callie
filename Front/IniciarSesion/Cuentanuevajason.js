let registrate = document.getElementById("registrate")
let boton = document.getElementById("boton")

if (registrate.contraseña.value != registrate.verificacion.value){
    alert("Verificacion fallida, volver a escribir la contraseña")
}
else{
    let contra = registrate.contraseña.value
}


async function Registrarse(){
     let user = {
        nombreDeUsuario: registrarte.nombre-usuario.value,
        contraseña: contra,
        fechaDeNacimiento: registrarte.nacimiento.value
     }
     /* 
   const restpuesta = await fetch("http://localhost:3000/*rutaDeSharon*", {
    method: `POST`
    headers: {'Content-type':  'application/json'}
    body: JSON.stringify(user)
  })
    COMPLETAR
     */
}

boton.addEventListener('click', (event) => {
    event.preventDefault();
    Registrarse()
})