from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_participaciones():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM participa;")
    participaciones = cursor.fetchall()

    cursor.close()
    conn.close()
    return participaciones


def get_participacion(id_evento: int, id_ponente: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM participa WHERE id_evento=%s AND id_ponente=%s;",
        (id_evento, id_ponente)
    )

    participacion = cursor.fetchone()

    cursor.close()
    conn.close()
    return participacion


def create_participacion(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO participa (id_evento, id_ponente, rol_evento)
        VALUES (%s,%s,%s)
        RETURNING *;
    """, (
        data["id_evento"],
        data["id_ponente"],
        data["rol_evento"]
    ))

    nueva = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nueva


def update_participacion(id_evento: int, id_ponente: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE participa
        SET rol_evento=%s
        WHERE id_evento=%s AND id_ponente=%s
        RETURNING *;
    """, (
        data["rol_evento"],
        id_evento,
        id_ponente
    ))

    actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return actualizada


def delete_participacion(id_evento: int, id_ponente: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM participa WHERE id_evento=%s AND id_ponente=%s RETURNING *;",
        (id_evento, id_ponente)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado