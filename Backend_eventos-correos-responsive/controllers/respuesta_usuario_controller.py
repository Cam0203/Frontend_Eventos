from fastapi import HTTPException
from models import respuesta_usuario_model


class RespuestaUsuarioController:

    def get_respuestas(self):
        respuestas = respuesta_usuario_model.get_all_respuestas()

        if not respuestas:
            raise HTTPException(status_code=404, detail="No hay respuestas registradas")

        return respuestas


    def get_respuesta(self, respuesta_id: int):
        respuesta = respuesta_usuario_model.get_respuesta_by_id(respuesta_id)

        if not respuesta:
            raise HTTPException(status_code=404, detail="Respuesta no encontrada")

        return respuesta


    def create_respuesta(self, data: dict):
        try:
            nueva = respuesta_usuario_model.create_respuesta(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_respuesta(self, respuesta_id: int, data: dict):
        actualizada = respuesta_usuario_model.update_respuesta(respuesta_id, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Respuesta no encontrada")

        return actualizada


    def delete_respuesta(self, respuesta_id: int):
        eliminado = respuesta_usuario_model.delete_respuesta(respuesta_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Respuesta no encontrada")

        return {"mensaje": "Respuesta eliminada correctamente"}