from fastapi import APIRouter
from controllers.inscribe_controller import InscribirController

router = APIRouter(
    prefix="/inscribe",
    tags=["Inscribir"]
)

controller = InscribirController()


@router.get("/")
def get_inscripciones():
    return controller.get_inscripciones()

@router.get("/usuario/{usuario_id}")
def get_inscripciones_usuario(usuario_id: int):
    return controller.get_inscripciones_usuario(usuario_id)

@router.get("/evento/{id_evento}")
def get_inscritos_evento(id_evento: int):
    return controller.get_inscritos_evento(id_evento)

@router.post("/")
def create_inscripcion(data: dict):
    return controller.create_inscripcion(data)


@router.put("/{usuario_id}/{evento_id}")
def update_inscripcion(usuario_id: int, evento_id: int, data: dict):
    return controller.update_inscripcion(usuario_id, evento_id, data)


@router.delete("/{usuario_id}/{evento_id}")
def delete_inscripcion(usuario_id: int, evento_id: int):
    return controller.delete_inscripcion(usuario_id, evento_id)