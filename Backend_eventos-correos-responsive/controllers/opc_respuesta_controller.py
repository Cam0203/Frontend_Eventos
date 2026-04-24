from fastapi import HTTPException
from models import opc_respuesta_model


class OpcionRespuestaController:

    def get_opciones(self):
        opciones = opc_respuesta_model.get_all_opciones()

        if not opciones:
            raise HTTPException(status_code=404, detail="No hay opciones registradas")

        return opciones


    def get_opcion(self, opcion_id: int):
        opcion = opc_respuesta_model.get_opcion_by_id(opcion_id)

        if not opcion:
            raise HTTPException(status_code=404, detail="Opción no encontrada")

        return opcion


    def create_opcion(self, data: dict):
        try:
            nueva = opc_respuesta_model.create_opcion(data)
            return nueva
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_opcion(self, opcion_id: int, data: dict):
        actualizada = opc_respuesta_model.update_opcion(opcion_id, data)

        if not actualizada:
            raise HTTPException(status_code=404, detail="Opción no encontrada")

        return actualizada


    def delete_opcion(self, opcion_id: int):
        eliminado = opc_respuesta_model.delete_opcion(opcion_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Opción no encontrada")

        return {"mensaje": "Opción eliminada correctamente"}