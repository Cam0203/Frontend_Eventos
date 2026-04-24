from fastapi import APIRouter
from controllers.lugar_controller import LugarController

router = APIRouter(prefix="/lugar",tags=["Lugar"])

controller = LugarController()


@router.get("/")
def get_lugares():
    return controller.get_lugares()


@router.get("/{lugar_id}")
def get_lugar(lugar_id: int):
    return controller.get_lugar(lugar_id)


@router.post("/")
def create_lugar(data: dict):
    return controller.create_lugar(data)


@router.put("/{lugar_id}")
def update_lugar(lugar_id: int, data: dict):
    return controller.update_lugar(lugar_id, data)


@router.delete("/{lugar_id}")
def delete_lugar(lugar_id: int):
    return controller.delete_lugar(lugar_id)