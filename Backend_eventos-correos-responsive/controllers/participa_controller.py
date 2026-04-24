from fastapi import HTTPException
from models import participa_model


class ParticipaController:

    def get_participaciones(self):
        participaciones = participa_model.get_all_participaciones()

        if not participaciones:
            raise HTTPException(status_code=404, detail="No hay participaciones registradas")

        return participaciones


    def get_participacion(self, id_evento: int, id_ponente: int):
        participacion = participa_model.get_participacion(id_evento, id_ponente)

        if not participacion:
            raise HTTPException(status_code=404, detail="Participación no encontrada")

        return participacion


    def create_participacion(self, data: dict):
        try:
            nueva = participa_model.create_participacion(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_participacion(self, id_evento: int, id_ponente: int, data: dict):
        actualizada = participa_model.update_participacion(id_evento, id_ponente, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Participación no encontrada")

        return actualizada


    def delete_participacion(self, id_evento: int, id_ponente: int):
        eliminado = participa_model.delete_participacion(id_evento, id_ponente)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Participación no encontrada")

        return {"mensaje": "Participación eliminada correctamente"}