from config.db_config import get_db_connection
from psycopg2.extras import RealDictCursor

class RolModel:

    def get_all_roles(self):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM rol')
        roles = cursor.fetchall()
        cursor.close()
        conn.close()
        return roles

    def get_rol(self, rol_id):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM rol WHERE id = %s', (rol_id,))
        rol = cursor.fetchone()
        cursor.close()
        conn.close()
        return rol

    def create_rol(self, data):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            'INSERT INTO rol (nombre, descripcion) VALUES (%s, %s)',
            (data["nombre"], data["descripcion"])
        )
        conn.commit()
        cursor.close()
        conn.close()

    def update_rol(self, rol_id, data):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            'UPDATE rol SET nombre = %s, descripcion = %s WHERE id = %s',
            (data["nombre"], data["descripcion"], rol_id)
        )
        conn.commit()
        cursor.close()
        conn.close()

    def delete_rol(self, rol_id):
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('DELETE FROM rol WHERE id = %s', (rol_id,))
        conn.commit()
        cursor.close()
        conn.close()