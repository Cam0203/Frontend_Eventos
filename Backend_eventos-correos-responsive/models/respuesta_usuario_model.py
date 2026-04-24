from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_respuestas():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM respuesta_usuario;")
    respuestas = cursor.fetchall()

    cursor.close()
    conn.close()
    return respuestas


def get_respuesta_by_id(respuesta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM respuesta_usuario WHERE id = %s;", (respuesta_id,))
    respuesta = cursor.fetchone()

    cursor.close()
    conn.close()
    return respuesta


def create_respuesta(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO respuesta_usuario
        (id_usuario, id_pregunta, id_opc_respuesta)
        VALUES (%s, %s, %s)
        RETURNING *;
    """, (
        data["id_usuario"],
        data["id_pregunta"],
        data["id_opc_respuesta"]
    ))

    nueva = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nueva


def update_respuesta(respuesta_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE respuesta_usuario SET
        id_usuario = %s,
        id_pregunta = %s,
        id_opc_respuesta = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["id_usuario"],
        data["id_pregunta"],
        data["id_opc_respuesta"],
        respuesta_id
    ))

    actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return actualizada


def delete_respuesta(respuesta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM respuesta_usuario WHERE id = %s RETURNING id;", (respuesta_id,))
    eliminado = cursor.fetchone()

    conn.commit()
    cursor.close()
    conn.close()
    return eliminado