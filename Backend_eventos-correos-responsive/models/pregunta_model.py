from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_preguntas():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM pregunta;")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


def get_pregunta_by_id(pregunta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM pregunta WHERE id=%s;",
        (pregunta_id,)
    )

    data = cursor.fetchone()

    cursor.close()
    conn.close()
    return data


def create_pregunta(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO pregunta (enunciado, id_encuesta)
        VALUES (%s,%s)
        RETURNING *;
    """, (
        data["enunciado"],
        data["id_encuesta"]
    ))

    new = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return new


def update_pregunta(pregunta_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE pregunta
        SET enunciado=%s,
            id_encuesta=%s
        WHERE id=%s
        RETURNING *;
    """, (
        data["enunciado"],
        data["id_encuesta"],
        pregunta_id
    ))

    updated = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return updated


def delete_pregunta(pregunta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM pregunta WHERE id=%s RETURNING *;",
        (pregunta_id,)
    )

    deleted = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return deleted