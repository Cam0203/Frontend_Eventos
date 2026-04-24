from fastapi import APIRouter
from controllers.encuesta_controller import EncuestaController

router = APIRouter(
    prefix="/encuesta",
    tags=["Encuesta"]
)

controller = EncuestaController()


@router.get("/")
def get_encuestas():
    return controller.get_encuestas()


@router.get("/{encuesta_id}")
def get_encuesta(encuesta_id: int):
    return controller.get_encuesta(encuesta_id)


@router.post("/")
def create_encuesta(data: dict):
    return controller.create_encuesta(data)


@router.put("/{encuesta_id}")
def update_encuesta(encuesta_id: int, data: dict):
    return controller.update_encuesta(encuesta_id, data)


@router.delete("/{encuesta_id}")
def delete_encuesta(encuesta_id: int):
    return controller.delete_encuesta(encuesta_id)