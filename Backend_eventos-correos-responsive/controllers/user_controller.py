from fastapi import HTTPException
from models import user_model


class UserController:

    def get_users(self):
        users = user_model.get_all_users()

        if not users:
            raise HTTPException(status_code=404, detail="No hay usuarios registrados")

        return users



    def get_user(self, user_id: int):
        user = user_model.get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return user



    def create_user(self, data: dict):
        try:
            new_user = user_model.create_user(data)
            return new_user
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_user(self, user_id: int, data: dict):
        updated_user = user_model.update_user(user_id, data)

        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return updated_user

    def delete_user(self, user_id: int):
        deleted = user_model.delete_user(user_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {"mensaje": "Usuario eliminado correctamente"}