import hashlib
import sqlite3

def create_database():
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS Certificates(
    certificateID TEXT NOT NULL primary key,
    name text NOT NULL,
    designation text NOT NULL,
    course text NOT NULL,
    year INTEGER NOT NULL,
    expiry_date text NOT NULL,
    hash text NOT NULL)""")
    conn.commit()
    conn.close()
create_database()