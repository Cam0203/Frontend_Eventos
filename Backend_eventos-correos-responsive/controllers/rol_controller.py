from models.rol_model import RolModel

class RolController:

    def __init__(self):
        self.model = RolModel()

    def get_roles(self):
        return self.model.get_all_roles()

    def get_rol(self, rol_id):
        return self.model.get_rol(rol_id)

    def create_rol(self, data):
        self.model.create_rol(data)
        return {"message": "Rol creado correctamente"}

    def update_rol(self, rol_id, data):
        self.model.update_rol(rol_id, data)
        return {"message": "Rol actualizado correctamente"}

    def delete_rol(self, rol_id):
        self.model.delete_rol(rol_id)
        return {"message": "Rol eliminado correctamente"}