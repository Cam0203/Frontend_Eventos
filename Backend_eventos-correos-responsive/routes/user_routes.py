from fastapi import APIRouter
from controllers.user_controller import UserController

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

user_controller = UserController()


@router.get("/")
def get_users():
    return user_controller.get_users()


@router.get("/{user_id}")
def get_user(user_id: int):
    return user_controller.get_user(user_id)


@router.post("/")
def create_user(data: dict):
    return user_controller.create_user(data)


@router.put("/{user_id}")
def update_user(user_id: int, data: dict):
    return user_controller.update_user(user_id, data)



@router.delete("/{user_id}")
def delete_user(user_id: int):
    return user_controller.delete_user(user_id)
