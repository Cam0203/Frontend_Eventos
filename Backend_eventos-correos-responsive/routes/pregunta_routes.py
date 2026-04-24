from fastapi import APIRouter
from controllers.pregunta_controller import PreguntaController

router = APIRouter(
    prefix="/pregunta",
    tags=["Pregunta"]
)

controller = PreguntaController()


@router.get("/")
def get_preguntas():
    return controller.get_preguntas()


@router.get("/{pregunta_id}")
def get_pregunta(pregunta_id: int):
    return controller.get_pregunta(pregunta_id)


@router.post("/")
def create_pregunta(data: dict):
    return controller.create_pregunta(data)


@router.put("/{pregunta_id}")
def update_pregunta(pregunta_id: int, data: dict):
    return controller.update_pregunta(pregunta_id, data)


@router.delete("/{pregunta_id}")
def delete_pregunta(pregunta_id: int):
    return controller.delete_pregunta(pregunta_id)