from fastapi import HTTPException
from models import login_model

class LoginController:

    def login(self, data: dict):

        usuario = login_model.verificar_usuario(
            data["correo"],
            data["contraseña"]
        )

        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        return {
            "mensaje": "Login exitoso",
            "id_usuario": usuario["id"],
            "usuario": usuario["primer_nombre"],
            "id_rol": usuario["id_rol"]
        }