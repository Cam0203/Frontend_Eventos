from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_eventos():

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT 
            e.*,
            p.primer_nombre,
            p.segundo_nombre,
            p.primer_apellido,
            p.segundo_apellido
        FROM evento e
        LEFT JOIN participa pa 
            ON pa.id_evento = e.id
        LEFT JOIN ponente p 
            ON p.id = pa.id_ponente
        ORDER BY e.fecha;
    """)

    eventos = cursor.fetchall()

    cursor.close()
    conn.close()

    return eventos


def get_evento_by_id(evento_id: int):

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        SELECT 
            e.*,
            pa.id_ponente AS id_ponente,
            p.primer_nombre,
            p.segundo_nombre,
            p.primer_apellido,
            p.segundo_apellido
        FROM evento e
        LEFT JOIN participa pa 
            ON pa.id_evento = e.id
        LEFT JOIN ponente p 
            ON p.id = pa.id_ponente
        WHERE e.id = %s;
    """, (evento_id,))

    evento = cursor.fetchone()

    cursor.close()
    conn.close()

    return evento


def create_evento(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO evento
        (nombre, descripcion, fecha, hora, cupo_max,
        modalidad, estado, id_lugar, id_categoria_evento)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *;
    """, (
        data["nombre"],
        data["descripcion"],
        data["fecha"],
        data["hora"],
        data["cupo_max"],
        data["modalidad"],
        data["estado"],
        data.get("id_lugar"),
        data["id_categoria_evento"]
    ))

    new_evento = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return new_evento


def update_evento(evento_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE evento SET
        nombre = %s,
        descripcion = %s,
        fecha = %s,
        hora = %s,
        cupo_max = %s,
        modalidad = %s,
        estado = %s,
        id_lugar = %s,
        id_categoria_evento = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["nombre"],
        data["descripcion"],
        data["fecha"],
        data["hora"],
        data["cupo_max"],
        data["modalidad"],
        data["estado"],
        data.get("id_lugar"),
        data["id_categoria_evento"],
        evento_id
    ))

    updated_evento = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return updated_evento

def delete_evento(evento_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM evento WHERE id = %s RETURNING id;", (evento_id,))
    deleted = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return deleted

def buscar_eventos_por_nombre(nombre_busqueda: str):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM evento WHERE LOWER(nombre) LIKE LOWER(%s)"
    cursor.execute(query, (f"%{nombre_busqueda}%",))
    
    eventos = cursor.fetchall()
    cursor.close()
    conn.close()
    return eventos