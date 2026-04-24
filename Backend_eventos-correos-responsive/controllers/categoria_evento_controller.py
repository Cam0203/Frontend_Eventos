from fastapi import HTTPException
from models import categoria_evento_model


class CategoriaEventoController:

    def get_categorias(self):
        categorias = categoria_evento_model.get_all_categoria_evento()

        if not categorias:
            raise HTTPException(status_code=404, detail="No hay categorías registradas")

        return categorias


    def get_categoria(self, categoria_id: int):
        categoria = categoria_evento_model.get_categoria_evento_by_id(categoria_id)

        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        return categoria


    def create_categoria(self, data: dict):
        try:
            nueva_categoria = categoria_evento_model.create_categoria_evento(data)
            return nueva_categoria
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    def update_categoria(self, categoria_id: int, data: dict):
        categoria_actualizada = categoria_evento_model.update_categoria_evento(categoria_id, data)

        if not categoria_actualizada:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        return categoria_actualizada


    def delete_categoria(self, categoria_id: int):
        eliminado = categoria_evento_model.delete_categoria_evento(categoria_id)

        if not eliminado:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        return {"mensaje": "Categoría eliminada correctamente"}