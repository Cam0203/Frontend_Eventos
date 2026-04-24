from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from correo import enviar_correo

app = FastAPI()
from routes.user_routes import router as user_router
from routes.rol_routes import router as rol_router
from routes.evento_routes import router as evento_router
from routes.categoria_evento_routes import router as categoria_evento_router
from routes.lugar_routes import router as lugar_router
from routes.programa_routes import router as programa_router
from routes.ponente_routes import router as ponente_router
from routes.inscribe_routes import router as inscribe_router
from routes.asistencia_routes import router as asistencia_router
from fastapi.middleware.cors import CORSMiddleware
from routes.participa_routes import router as participa_router
from routes.encuesta_routes import router as encuesta_router
from routes.pregunta_routes import router as pregunta_router
from routes.opc_respuesta_routes import router as opc_respuesta_router
from routes.respuesta_usuario_routes import router as respuesta_usuario_router
from routes.login_routes import router as login_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar quién tiene permiso
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(rol_router)
app.include_router(evento_router)
app.include_router(categoria_evento_router)
app.include_router(lugar_router)
app.include_router(programa_router)
app.include_router(ponente_router)
app.include_router(inscribe_router)
app.include_router(asistencia_router)
app.include_router(participa_router)
app.include_router(encuesta_router)
app.include_router(pregunta_router)
app.include_router(opc_respuesta_router)
app.include_router(respuesta_usuario_router)
app.include_router(login_router)

class CorreoRequest(BaseModel):
    destinatario: EmailStr
    asunto: str
    mensaje: str

@app.post("/enviar-correo")
async def enviar_correo_api(data: CorreoRequest):
    await enviar_correo(
        data.destinatario,
        data.asunto,
        data.mensaje
    )
    return {"mensaje": "Correo enviado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)