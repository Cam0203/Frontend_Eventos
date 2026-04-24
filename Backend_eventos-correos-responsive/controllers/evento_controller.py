from fastapi import HTTPException
from models import evento_model
from models import inscribe_model
from models.evento_model import buscar_eventos_por_nombre # Asegúrate de importar la función


class EventoController:

    def get_eventos(self):

        eventos = evento_model.get_all_eventos()

        if not eventos:
            raise HTTPException(status_code=404, detail="No hay eventos registrados")

        for evento in eventos:

            inscritos = inscribe_model.contar_inscritos(evento["id"])

            evento["inscritos"] = inscritos

        return eventos


    def get_evento(self, evento_id: int):
        evento = evento_model.get_evento_by_id(evento_id)

        if not evento:
            raise HTTPException(status_code=404, detail="Evento no encontrado")

        return evento


    def create_evento(self, data: dict):
        try:
            return evento_model.create_evento(data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_evento(self, evento_id: int, data: dict):
        updated = evento_model.update_evento(evento_id, data)

        if not updated:
            raise HTTPException(status_code=404, detail="Evento no encontrado")

        return updated


    def delete_evento(self, evento_id: int):
        deleted = evento_model.delete_evento(evento_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Evento no encontrado")

        return {"mensaje": "Evento eliminado correctamente"}
    
    def buscar_eventos_nombre(nombre: str):
        return buscar_eventos_por_nombre(nombre)
