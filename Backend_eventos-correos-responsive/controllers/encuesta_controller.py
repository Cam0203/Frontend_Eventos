from fastapi import HTTPException
from models import encuesta_model


class EncuestaController:

    def get_encuestas(self):
        encuestas = encuesta_model.get_all_encuestas()

        if not encuestas:
            raise HTTPException(status_code=404, detail="No hay encuestas registradas")

        return encuestas


    def get_encuesta(self, encuesta_id: int):
        encuesta = encuesta_model.get_encuesta_by_id(encuesta_id)

        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        return encuesta


    def create_encuesta(self, data: dict):
        try:
            nueva = encuesta_model.create_encuesta(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_encuesta(self, encuesta_id: int, data: dict):
        actualizada = encuesta_model.update_encuesta(encuesta_id, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        return actualizada


    def delete_encuesta(self, encuesta_id: int):
        eliminado = encuesta_model.delete_encuesta(encuesta_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        return {"mensaje": "Encuesta eliminada correctamente"}