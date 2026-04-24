from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_categoria_evento():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM categoria_evento;")
    categorias = cursor.fetchall()

    cursor.close()
    conn.close()
    return categorias


def get_categoria_evento_by_id(categoria_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM categoria_evento WHERE id = %s;",
        (categoria_id,)
    )

    categoria = cursor.fetchone()

    cursor.close()
    conn.close()
    return categoria


def create_categoria_evento(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO categoria_evento (nombre_categoria, descripcion)
        VALUES (%s, %s)
        RETURNING *;
    """, (
        data["nombre_categoria"],
        data["descripcion"]
    ))

    nueva_categoria = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return nueva_categoria


def update_categoria_evento(categoria_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE categoria_evento
        SET nombre_categoria = %s,
            descripcion = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["nombre_categoria"],
        data["descripcion"],
        categoria_id
    ))

    categoria_actualizada = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return categoria_actualizada


def delete_categoria_evento(categoria_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM categoria_evento WHERE id = %s RETURNING id;",
        (categoria_id,)
    )

    eliminado = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return eliminado