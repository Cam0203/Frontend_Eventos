from fastapi import HTTPException
from models import lugar_model


class LugarController:

    def get_lugares(self):
        lugares = lugar_model.get_all_lugares()

        if not lugares:
            raise HTTPException(status_code=404, detail="No hay lugares registrados")

        return lugares


    def get_lugar(self, lugar_id: int):
        lugar = lugar_model.get_lugar_by_id(lugar_id)

        if not lugar:
            raise HTTPException(status_code=404, detail="Lugar no encontrado")

        return lugar


    def create_lugar(self, data: dict):
        try:
            nuevo_lugar = lugar_model.create_lugar(data)
            return nuevo_lugar
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_lugar(self, lugar_id: int, data: dict):
        lugar_actualizado = lugar_model.update_lugar(lugar_id, data)

        if not lugar_actualizado:
            raise HTTPException(status_code=404, detail="Lugar no encontrado")

        return lugar_actualizado


    def delete_lugar(self, lugar_id: int):
        eliminado = lugar_model.delete_lugar(lugar_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Lugar no encontrado")

        return {"mensaje": "Lugar eliminado correctamente"}