
    async function login() {
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("password").value.trim();
    document.getElementById("error").textContent = "";

    if (!correo || !contraseña) {
        document.getElementById("error").textContent = "Por favor, completa todos los campos.";
        return;
    }

    try {
        const respuesta = await fetch("https://backend-eventos-rth3.onrender.com/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            correo: correo,
            contraseña: contraseña
        })
        });

        const data = await respuesta.json();

        if (respuesta.ok && data.id_usuario) {
        localStorage.setItem("usuario", JSON.stringify({
            id_usuario: data.id_usuario,
            usuario: data.usuario,
            rol: data.id_rol
        }));

        if (data.id_rol == 3) {
            window.location.href = "admin.html";
        } else if (data.id_rol == 1) {
            window.location.href = "estudiante.html";
        } else if (data.id_rol == 5) {
            window.location.href = "coordinador.html";

        } else {
        document.getElementById("error").textContent =
    data.mensaje || "Usuario o contraseña incorrectos";
        }
    }

    } catch (error) {
        console.error("Error en login:", error);
        alert("No se pudo conectar con el servidor.");
    }
    }