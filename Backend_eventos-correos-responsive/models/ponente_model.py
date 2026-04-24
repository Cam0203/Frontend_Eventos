from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_ponentes():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM ponente;")
    ponentes = cursor.fetchall()

    cursor.close()
    conn.close()
    return ponentes


def get_ponente_by_id(ponente_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM ponente WHERE id = %s;",
        (ponente_id,)
    )

    ponente = cursor.fetchone()

    cursor.close()
    conn.close()
    return ponente


def create_ponente(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO ponente (
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            correo,
            telefono,
            profesion,
            institucion
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING *;
    """, (
        data["primer_nombre"],
        data.get("segundo_nombre"),
        data["primer_apellido"],
        data.get("segundo_apellido"),
        data["correo"],
        data.get("telefono"),
        data["profesion"],
        data["institucion"]
    ))

    nuevo_ponente = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nuevo_ponente


def update_ponente(ponente_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE ponente SET
        primer_nombre = %s,
        segundo_nombre = %s,
        primer_apellido = %s,
        segundo_apellido = %s,
        correo = %s,
        telefono = %s,
        profesion = %s,
        institucion = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["primer_nombre"],
        data.get("segundo_nombre"),
        data["primer_apellido"],
        data.get("segundo_apellido"),
        data["correo"],
        data.get("telefono"),
        data["profesion"],
        data["institucion"],
        ponente_id
    ))

    ponente_actualizado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return ponente_actualizado


def delete_ponente(ponente_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM ponente WHERE id = %s RETURNING id;",
        (ponente_id,)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado