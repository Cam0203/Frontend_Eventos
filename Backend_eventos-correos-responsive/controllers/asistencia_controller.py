from fastapi import HTTPException
from models import asistencia_model


class AsistenciaController:

    def get_asistencias(self):
        asistencias = asistencia_model.get_all_asistencias()

        if not asistencias:
            raise HTTPException(status_code=404, detail="No hay asistencias registradas")

        return asistencias


    def get_asistencia(self, id_inscribe: int):
        asistencia = asistencia_model.get_asistencia_by_id(id_inscribe)

        if not asistencia:
            raise HTTPException(status_code=404, detail="Asistencia no encontrada")

        return asistencia


    def create_asistencia(self, data: dict):
        try:
            nueva = asistencia_model.create_asistencia(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_asistencia(self, id_inscribe: int, data: dict):
        actualizada = asistencia_model.update_asistencia(id_inscribe, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Asistencia no encontrada")

        return actualizada


    def delete_asistencia(self, id_inscribe: int):
        eliminado = asistencia_model.delete_asistencia(id_inscribe)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Asistencia no encontrada")

        return {"mensaje": "Asistencia eliminada correctamente"}

    def get_asistencia_evento(self, id_evento: int):
        try:
            return asistencia_model.get_asistencia_evento(id_evento)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    