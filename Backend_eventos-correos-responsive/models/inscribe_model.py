from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_inscripciones():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM inscribe;")
    inscripciones = cursor.fetchall()

    cursor.close()
    conn.close()
    return inscripciones


def get_inscripcion(usuario_id: int, evento_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM inscribe WHERE id_usuario = %s AND id_evento = %s;",
        (usuario_id, evento_id)
    )

    inscripcion = cursor.fetchone()

    cursor.close()
    conn.close()
    return inscripcion


def create_inscripcion(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO inscribe (id_usuario, id_evento, fecha, estado)
        VALUES (%s,%s,%s,%s)
        RETURNING *;
    """, (
        data["id_usuario"],
        data["id_evento"],
        data["fecha"],
        data["estado"]
    ))

    nueva = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nueva


def update_inscripcion(usuario_id: int, evento_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE inscribe
        SET fecha= %s,
            estado = %s
        WHERE id_usuario = %s AND id_evento = %s
        RETURNING *;
    """, (
        data["fecha"],
        data["estado"],
        usuario_id,
        evento_id
    ))

    actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return actualizada


def delete_inscripcion(usuario_id: int, evento_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM inscribe WHERE id_usuario=%s AND id_evento=%s RETURNING *;",
        (usuario_id, evento_id)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado

def get_inscripciones_usuario(usuario_id: int):

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT id_evento FROM inscribe WHERE id_usuario = %s;",
        (usuario_id,)
    )

    inscripciones = cursor.fetchall()

    cursor.close()
    conn.close()

    return inscripciones

def contar_inscritos(id_evento):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM inscribe WHERE id_evento = %s;",
        (id_evento,)
    )

    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return total

def obtener_cupo_evento(id_evento):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT cupo_max FROM evento WHERE id = %s;",
        (id_evento,)
    )

    cupo = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return cupo

def get_inscritos_evento(id_evento):

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT
        i.id AS id_inscripcion,
        u.primer_nombre,
        u.primer_apellido,
        u.correo_institucional,
        i.fecha
        FROM inscribe i
        JOIN usuario u ON u.id = i.id_usuario
        WHERE i.id_evento = %s;
        """, (id_evento,))

    inscritos = cursor.fetchall()

    cursor.close()
    conn.close()

    return inscritos
