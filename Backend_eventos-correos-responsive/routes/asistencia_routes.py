from fastapi import APIRouter
from controllers.asistencia_controller import AsistenciaController

router = APIRouter(
    prefix="/asistencia",
    tags=["Asistencia"]
)

controller = AsistenciaController()


@router.get("/")
def get_asistencias():
    return controller.get_asistencias()


@router.get("/{id_inscribe}")
def get_asistencia(id_inscribe: int):
    return controller.get_asistencia(id_inscribe)


@router.post("/")
def create_asistencia(data: dict):
    return controller.create_asistencia(data)


@router.put("/{id_inscribe}")
def update_asistencia(id_inscribe: int, data: dict):
    return controller.update_asistencia(id_inscribe, data)


@router.delete("/{id_inscribe}")
def delete_asistencia(id_inscribe: int):
    return controller.delete_asistencia(id_inscribe)

@router.get("/evento/{id_evento}")
def get_asistencia_evento(id_evento: int):
    return controller.get_asistencia_evento(id_evento)