from fastapi import APIRouter
from controllers.rol_controller import RolController

router = APIRouter(prefix="/roles", tags=["Roles"])
controller = RolController()

@router.get("/")
def get_roles():
    return controller.get_roles()

@router.get("/{rol_id}")
def get_rol(rol_id: int):
    return controller.get_rol(rol_id)

@router.post("/")
def create_rol(data: dict):
    return controller.create_rol(data)

@router.put("/{rol_id}")
def update_rol(rol_id: int, data: dict):
    return controller.update_rol(rol_id, data)

@router.delete("/{rol_id}")
def delete_rol(rol_id: int):
    return controller.delete_rol(rol_id)