from fastapi import HTTPException
from models import ponente_model


class PonenteController:

    def get_ponentes(self):
        ponentes = ponente_model.get_all_ponentes()

        if not ponentes:
            raise HTTPException(status_code=404, detail="No hay ponentes registrados")

        return ponentes


    def get_ponente(self, ponente_id: int):
        ponente = ponente_model.get_ponente_by_id(ponente_id)

        if not ponente:
            raise HTTPException(status_code=404, detail="Ponente no encontrado")

        return ponente


    def create_ponente(self, data: dict):
        try:
            nuevo_ponente = ponente_model.create_ponente(data)
            return nuevo_ponente
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_ponente(self, ponente_id: int, data: dict):
        ponente_actualizado = ponente_model.update_ponente(ponente_id, data)

        if not ponente_actualizado:
            raise HTTPException(status_code=404, detail="Ponente no encontrado")

        return ponente_actualizado


    def delete_ponente(self, ponente_id: int):
        eliminado = ponente_model.delete_ponente(ponente_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Ponente no encontrado")

        return {"mensaje": "Ponente eliminado correctamente"}