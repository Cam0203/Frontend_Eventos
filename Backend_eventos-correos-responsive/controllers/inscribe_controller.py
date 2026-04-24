from fastapi import HTTPException
from models import inscribe_model


class InscribirController:

    def get_inscripciones(self):
        inscripciones = inscribe_model.get_all_inscripciones()

        if not inscripciones:
            raise HTTPException(status_code=404, detail="No hay inscripciones")

        return inscripciones


    def get_inscripcion(self, usuario_id: int, evento_id: int):
        inscripcion = inscribe_model.get_inscripcion(usuario_id, evento_id)

        if not inscripcion:
            raise HTTPException(status_code=404, detail="Inscripción no encontrada")

        return inscripcion


    def create_inscripcion(self, data: dict):

        id_evento = data.get("id_evento")

        if not id_evento:
            raise HTTPException(
                status_code=400,
                detail="id_evento es obligatorio"
            )

        inscritos = inscribe_model.contar_inscritos(id_evento)
        cupo_max = inscribe_model.obtener_cupo_evento(id_evento)

        if inscritos >= cupo_max:
            raise HTTPException(
                status_code=400,
                detail="El evento ya no tiene cupos disponibles"
            )

        try:
            nueva = inscribe_model.create_inscripcion(data)
            return nueva

        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def delete_inscripcion(self, usuario_id: int, evento_id: int):
        eliminado = inscribe_model.delete_inscripcion(usuario_id, evento_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Inscripción no encontrada")

        return {"mensaje": "Inscripción eliminada correctamente"}

    def get_inscripciones_usuario(self, usuario_id: int):

        inscripciones = inscribe_model.get_inscripciones_usuario(usuario_id)

        return inscripciones
    
    def get_inscritos_evento(self, id_evento: int):

        inscritos = inscribe_model.get_inscritos_evento(id_evento)

        if not inscritos:
            return []

        return inscritos