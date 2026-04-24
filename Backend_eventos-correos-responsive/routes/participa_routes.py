from fastapi import APIRouter
from controllers.participa_controller import ParticipaController

router = APIRouter(
    prefix="/participa",
    tags=["Participa"]
)

controller = ParticipaController()


@router.get("/")
def get_participaciones():
    return controller.get_participaciones()


@router.get("/{id_evento}/{id_ponente}")
def get_participacion(id_evento: int, id_ponente: int):
    return controller.get_participacion(id_evento, id_ponente)


@router.post("/")
def create_participacion(data: dict):
    return controller.create_participacion(data)


@router.put("/{id_evento}/{id_ponente}")
def update_participacion(id_evento: int, id_ponente: int, data: dict):
    return controller.update_participacion(id_evento, id_ponente, data)


@router.delete("/{id_evento}/{id_ponente}")
def delete_participacion(id_evento: int, id_ponente: int):
    return controller.delete_participacion(id_evento, id_ponente)