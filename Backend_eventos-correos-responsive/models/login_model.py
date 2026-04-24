from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def verificar_usuario(correo, contraseña):

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT id, primer_nombre, id_rol
        FROM usuario
        WHERE correo_institucional = %s
        AND contraseña = %s;
    """, (correo, contraseña))

    usuario = cursor.fetchone()

    cursor.close()
    conn.close()

    return usuario