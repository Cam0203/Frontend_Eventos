from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME="yeseniamosquerach22@gmail.com",
    MAIL_PASSWORD="vkhg sxjc jogm wlst",
    MAIL_FROM="yeseniamosquerach22@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Sistema Eventos",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def enviar_correo(destinatario: EmailStr, asunto: str, mensaje: str):
    message = MessageSchema(
        subject=asunto,
        recipients=[destinatario],
        body=mensaje,
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)