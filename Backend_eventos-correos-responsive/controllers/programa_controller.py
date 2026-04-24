from fastapi import HTTPException
from models import programa_model


class ProgramaController:

    def get_programas(self):
        programas = programa_model.get_all_programas()

        if not programas:
            raise HTTPException(status_code=404, detail="No hay programas registrados")

        return programas


    def get_programa(self, programa_id: int):
        programa = programa_model.get_programa_by_id(programa_id)

        if not programa:
            raise HTTPException(status_code=404, detail="Programa no encontrado")

        return programa


    def create_programa(self, data: dict):
        try:
            nuevo_programa = programa_model.create_programa(data)
            return nuevo_programa
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_programa(self, programa_id: int, data: dict):
        programa_actualizado = programa_model.update_programa(programa_id, data)

        if not programa_actualizado:
            raise HTTPException(status_code=404, detail="Programa no encontrado")

        return programa_actualizado


    def delete_programa(self, programa_id: int):
        eliminado = programa_model.delete_programa(programa_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Programa no encontrado")

        return {"mensaje": "Programa eliminado correctamente"}