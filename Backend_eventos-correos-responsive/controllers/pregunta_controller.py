from fastapi import HTTPException
from models import pregunta_model


class PreguntaController:

    def get_preguntas(self):
        preguntas = pregunta_model.get_all_preguntas()

        if not preguntas:
            raise HTTPException(status_code=404, detail="No hay preguntas registradas")

        return preguntas


    def get_pregunta(self, pregunta_id: int):
        pregunta = pregunta_model.get_pregunta_by_id(pregunta_id)

        if not pregunta:
            raise HTTPException(status_code=404, detail="Pregunta no encontrada")

        return pregunta


    def create_pregunta(self, data: dict):
        try:
            nueva = pregunta_model.create_pregunta(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_pregunta(self, pregunta_id: int, data: dict):
        actualizada = pregunta_model.update_pregunta(pregunta_id, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Pregunta no encontrada")

        return actualizada


    def delete_pregunta(self, pregunta_id: int):
        eliminado = pregunta_model.delete_pregunta(pregunta_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Pregunta no encontrada")

        return {"mensaje": "Pregunta eliminada correctamente"}