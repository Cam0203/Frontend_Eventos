from fastapi import APIRouter
from controllers.respuesta_usuario_controller import RespuestaUsuarioController

router = APIRouter(
    prefix="/respuesta_usuario",
    tags=["Respuesta Usuario"]
)

controller = RespuestaUsuarioController()


@router.get("/")
def get_respuestas():
    return controller.get_respuestas()


@router.get("/{respuesta_id}")
def get_respuesta(respuesta_id: int):
    return controller.get_respuesta(respuesta_id)


@router.post("/")
def create_respuesta(data: dict):
    return controller.create_respuesta(data)


@router.put("/{respuesta_id}")
def update_respuesta(respuesta_id: int, data: dict):
    return controller.update_respuesta(respuesta_id, data)


@router.delete("/{respuesta_id}")
def delete_respuesta(respuesta_id: int):
    return controller.delete_respuesta(respuesta_id)