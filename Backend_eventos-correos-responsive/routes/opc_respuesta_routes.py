from fastapi import APIRouter
from controllers.opc_respuesta_controller import OpcionRespuestaController

router = APIRouter(
    prefix="/opc_respuesta",
    tags=["Opciones Respuesta"]
)

controller = OpcionRespuestaController()


@router.get("/")
def get_opciones():
    return controller.get_opciones()


@router.get("/{opcion_id}")
def get_opcion(opcion_id: int):
    return controller.get_opcion(opcion_id)


@router.post("/")
def create_opcion(data: dict):
    return controller.create_opcion(data)


@router.put("/{opcion_id}")
def update_opcion(opcion_id: int, data: dict):
    return controller.update_opcion(opcion_id, data)


@router.delete("/{opcion_id}")
def delete_opcion(opcion_id: int):
    return controller.delete_opcion(opcion_id)