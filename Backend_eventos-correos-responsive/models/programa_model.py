from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_programas():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM programa;")
    programas = cursor.fetchall()

    cursor.close()
    conn.close()
    return programas


def get_programa_by_id(programa_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM programa WHERE id = %s;",
        (programa_id,)
    )

    programa = cursor.fetchone()

    cursor.close()
    conn.close()
    return programa


def create_programa(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO programa (nombre)
        VALUES (%s)
        RETURNING *;
    """, (data["nombre"],))

    nuevo_programa = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nuevo_programa


def update_programa(programa_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE programa
        SET nombre = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["nombre"],
        programa_id
    ))

    programa_actualizado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return programa_actualizado


def delete_programa(programa_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM programa WHERE id = %s RETURNING id;",
        (programa_id,)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado