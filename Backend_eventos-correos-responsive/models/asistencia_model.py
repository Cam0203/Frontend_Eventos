from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_asistencias():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM asistencia;")
    asistencias = cursor.fetchall()

    cursor.close()
    conn.close()
    return asistencias


def get_asistencia_by_id(id_inscribe: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM asistencia WHERE id_inscribe = %s;",
        (id_inscribe,)
    )

    asistencia = cursor.fetchone()

    cursor.close()
    conn.close()
    return asistencia


def create_asistencia(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO asistencia (id_inscribe, estado, fecha)
        VALUES (%s, %s, CURRENT_DATE)
        ON CONFLICT (id_inscribe)
        DO UPDATE SET
            estado = EXCLUDED.estado,
            fecha = CURRENT_DATE
        RETURNING *;
    """, (
        data["id_inscribe"],
        data["estado"]
    ))

    nueva = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()

    return nueva


def update_asistencia(id_inscribe: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE asistencia
        SET fecha=%s,
            estado=%s
        WHERE id_inscribe=%s
        RETURNING *;
    """, (
        data["fecha"],
        data["estado"],
        id_inscribe
    ))

    actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return actualizada


def delete_asistencia(id_inscribe: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM asistencia WHERE id_inscribe=%s RETURNING *;",
        (id_inscribe,)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado

def get_asistencia_evento(id_evento):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT 
            a.id_inscribe AS id_inscripcion,
            a.estado
        FROM asistencia a
        JOIN inscribe i ON i.id = a.id_inscribe
        WHERE i.id_evento = %s;
    """, (id_evento,))

    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data