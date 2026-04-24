from fastapi import APIRouter
from controllers.evento_controller import EventoController
from correo import enviar_correo


router = APIRouter(prefix="/eventos", tags=["Eventos"])

evento_controller = EventoController()


@router.get("/")
def get_eventos():
    return evento_controller.get_eventos()


@router.get("/{evento_id}")
def get_evento(evento_id: int):
    return evento_controller.get_evento(evento_id)


@router.post("/")
async def create_evento(data: dict):
    resultado = evento_controller.create_evento(data)

    # ENVÍO DE CORREO
    await enviar_correo(
        "yeseniamosquerach22@gmail.com",
        "Nuevo evento creado",
        f"Se ha creado un evento: {data.get('nombre', 'Sin nombre')}"
    )

    return resultado


@router.put("/{evento_id}")
def update_evento(evento_id: int, data: dict):
    return evento_controller.update_evento(evento_id, data)


@router.delete("/{evento_id}")
def delete_evento(evento_id: int):
    return evento_controller.delete_evento(evento_id)

@router.get("/buscar/nombre/{nombre}")
def buscar_por_nombre(nombre: str):
    return evento_controller.buscar_eventos_nombre(nombre)