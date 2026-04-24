from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_lugares():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM lugar;")
    categorias = cursor.fetchall()

    cursor.close()
    conn.close()
    return categorias


def get_lugar_by_id(lugar_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM lugar WHERE id = %s;",
        (lugar_id,)
    )

    categoria = cursor.fetchone()

    cursor.close()
    conn.close()
    return categoria


def create_lugar(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO lugar (nombre, bloque, capacidad, tipo_lugar)
        VALUES (%s, %s,%s,%s)
        RETURNING *;
    """, (
        data["nombre"],
        data["bloque"],
        data["capacidad"],
        data["tipo_lugar"]
    ))

    nuevo_lugar= cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nuevo_lugar


def update_lugar(lugar_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE lugar
        SET nombre = %s,
            bloque = %s,
            capacidad = %s,
            tipo_lugar = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["nombre"],
        data["bloque"],
        data["capacidad"],
        data["tipo_lugar"],
        lugar_id
    ))

    lugar_actualizado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return lugar_actualizado


def delete_lugar(lugar_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM lugar WHERE id = %s RETURNING id;",
        (lugar_id,)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado