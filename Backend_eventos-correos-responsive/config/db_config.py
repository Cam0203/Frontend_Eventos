import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="ep-lively-flower-aiyeojvm-pooler.c-4.us-east-1.aws.neon.tech",
        port="5432",
        user="neondb_owner",
        password="npg_iYA1LVwOrS5k",
        dbname="neondb",
        sslmode="require"
    )