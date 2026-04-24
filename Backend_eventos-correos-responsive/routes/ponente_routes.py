from fastapi import APIRouter
from controllers.ponente_controller import PonenteController

router = APIRouter(
    prefix="/ponente",
    tags=["Ponente"]
)

controller = PonenteController()


@router.get("/")
def get_ponentes():
    return controller.get_ponentes()


@router.get("/{ponente_id}")
def get_ponente(ponente_id: int):
    return controller.get_ponente(ponente_id)


@router.post("/")
def create_ponente(data: dict):
    return controller.create_ponente(data)


@router.put("/{ponente_id}")
def update_ponente(ponente_id: int, data: dict):
    return controller.update_ponente(ponente_id, data)


@router.delete("/{ponente_id}")
def delete_ponente(ponente_id: int):
    return controller.delete_ponente(ponente_id)