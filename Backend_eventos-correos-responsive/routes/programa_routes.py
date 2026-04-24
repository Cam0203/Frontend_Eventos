from fastapi import APIRouter
from controllers.programa_controller import ProgramaController

router = APIRouter(prefix="/programa",tags=["Programa"])

controller = ProgramaController()


@router.get("/")
def get_programas():
    return controller.get_programas()


@router.get("/{programa_id}")
def get_programa(programa_id: int):
    return controller.get_programa(programa_id)


@router.post("/")
def create_programa(data: dict):
    return controller.create_programa(data)


@router.put("/{programa_id}")
def update_programa(programa_id: int, data: dict):
    return controller.update_programa(programa_id, data)


@router.delete("/{programa_id}")
def delete_programa(programa_id: int):
    return controller.delete_programa(programa_id)