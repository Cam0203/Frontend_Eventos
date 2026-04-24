async function enviarNotificacionCorreo(destinatario, asunto, mensaje) {
    try {
        const respuesta = await fetch(`${BASE_URL}/correo/enviar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destinatario,
                asunto,
                mensaje
            })
        });

        if (!respuesta.ok) {
            console.log("No se pudo enviar el correo");
            return false;
        }

        console.log("Correo enviado correctamente");
        return true;

    } catch (error) {
        console.log("Error enviando correo:", error);
        return false;
    }
}