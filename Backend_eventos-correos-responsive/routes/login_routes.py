from fastapi import APIRouter
from controllers.login_controller import LoginController

router = APIRouter(prefix="/login", tags=["Login"])

controller = LoginController()


@router.post("/")
def login(data: dict):
    return controller.login(data)