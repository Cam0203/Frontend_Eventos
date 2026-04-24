from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_encuestas():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM encuesta;")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


def get_encuesta_by_id(encuesta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM encuesta WHERE id=%s;",
        (encuesta_id,)
    )

    data = cursor.fetchone()

    cursor.close()
    conn.close()
    return data


def create_encuesta(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO encuesta (titulo, descripcion, id_evento)
        VALUES (%s,%s,%s)
        RETURNING *;
    """, (
        data["titulo"],
        data["descripcion"],
        data["id_evento"]
    ))

    new = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return new


def update_encuesta(encuesta_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE encuesta
        SET titulo=%s,
            descripcion=%s,
            id_evento=%s
        WHERE id=%s
        RETURNING *;
    """, (
        data["titulo"],
        data["descripcion"],
        data["id_evento"],
        encuesta_id
    ))

    updated = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return updated


def delete_encuesta(encuesta_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM encuesta WHERE id=%s RETURNING *;",
        (encuesta_id,)
    )

    deleted = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return deleted