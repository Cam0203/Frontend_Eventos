from fastapi import APIRouter
from controllers.categoria_evento_controller import CategoriaEventoController

router = APIRouter(prefix="/categoria_evento",tags=["Categoria de eventos"])

controller = CategoriaEventoController()


@router.get("/")
def get_categorias():
    return controller.get_categorias()


@router.get("/{categoria_id}")
def get_categoria(categoria_id: int):
    return controller.get_categoria(categoria_id)


@router.post("/")
def create_categoria(data: dict):
    return controller.create_categoria(data)


@router.put("/{categoria_id}")
def update_categoria(categoria_id: int, data: dict):
    return controller.update_categoria(categoria_id, data)


@router.delete("/{categoria_id}")
def delete_categoria(categoria_id: int):
    return controller.delete_categoria(categoria_id)