from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor


def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM usuario;")
    users = cursor.fetchall()

    cursor.close()
    conn.close()
    return users


def get_user_by_id(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM usuario WHERE id = %s;", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()
    return user



def create_user(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        INSERT INTO usuario
        (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        correo_institucional, telefono, id_rol, id_programa)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *;
    """, (
        data["primer_nombre"],
        data.get("segundo_nombre"),
        data["primer_apellido"],
        data.get("segundo_apellido"),
        data["correo_institucional"],
        data.get("telefono"),
        data["id_rol"],
        data["id_programa"]
    ))

    new_user = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return new_user


def update_user(user_id: int, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("""
        UPDATE usuario SET
        primer_nombre = %s,
        segundo_nombre = %s,
        primer_apellido = %s,
        segundo_apellido = %s,
        correo_institucional = %s,
        telefono = %s,
        id_rol = %s,
        id_programa = %s
        WHERE id = %s
        RETURNING *;
    """, (
        data["primer_nombre"],
        data.get("segundo_nombre"),
        data["primer_apellido"],
        data.get("segundo_apellido"),
        data["correo_institucional"],
        data.get("telefono"),
        data["id_rol"],
        data["id_programa"],
        user_id
    ))

    updated_user = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return updated_user


def delete_user(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM usuario WHERE id = %s RETURNING id;", (user_id,))
    deleted = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()
    return deleted