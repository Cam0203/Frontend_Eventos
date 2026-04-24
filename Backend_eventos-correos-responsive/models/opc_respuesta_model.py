from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_opciones():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM opc_respuesta;")
    opciones = cursor.fetchall()

    cursor.close()
    conn.close()
    return opciones


def get_opcion_by_id(opcion_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM opc_respuesta WHERE id = %s;", (opcion_id,))
    opcion = cursor.fetchone()

    cursor.close()
    conn.close()
    return opcion


def create_opcion(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO opc_respuesta
        (descripcion, id_pregunta)
        VALUES (%s, %s)
        RETURNING *;
    """, (
        data["descripcion"],
        data["id_pregunta"]
    ))

    nueva = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nueva


def update_opcion(opcion_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE opc_respuesta SET
        descripcion = %s,
        id_pregunta = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["descripcion"],
        data["id_pregunta"],
        opcion_id
    ))

    actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return actualizada


def delete_opcion(opcion_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM opc_respuesta WHERE id = %s RETURNING id;", (opcion_id,))
    eliminado = cursor.fetchone()

    conn.commit()
    cursor.close()
    conn.close()
    return eliminado