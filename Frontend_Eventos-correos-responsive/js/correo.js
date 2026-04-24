function enviarCorreo(destinatario, asunto, mensaje) {
    fetch("http://127.0.0.1:8000/enviar-correo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            destinatario: destinatario,
            asunto: asunto,
            mensaje: mensaje
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Correo enviado", data);
        alert("Correo enviado correctamente");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al enviar correo");
    });
}
function eliminarUsuarioDemo() {
    alert("Entró a la función");
};

    enviarCorreo(
        "yeseniamosquerach22@gmail.com",
        "Cuenta eliminada",
        "Tu usuario ha sido eliminado del sistema"
    );
