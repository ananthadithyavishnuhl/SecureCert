from MerkleTreeApplication import *
import sqlite3

conn = sqlite3.connect('Certificates.db')
cursor = conn.cursor()
current_root=None
cursor.execute("""CREATE TABLE IF NOT EXISTS Certificates(
certificateID TEXT NOT NULL primary key,
name text NOT NULL,
designation text NOT NULL,
course text NOT NULL,
year INTEGER NOT NULL,
expiry_date text,
hash text NOT NULL)""")
conn.commit()
conn.close()

def insert_certificate(certificate):
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Certificates VALUES (?,?,?,?,?,?,?)",
                   (certificate["credential_id"],
            certificate["name"],
            certificate["designation"],
            certificate["course"],
            certificate["year"],
            certificate["expiry"],
            certificate["hash"]))
    conn.commit()
    conn.close()
    merkleRoot()

def get_certificate(credential_id):
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Certificates WHERE certificateID = ?",
                   (credential_id,))
    cert = cursor.fetchone()
    conn.close()
    return cert
def get_certificate_hash():
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("SELECT hash FROM Certificates")
    hash = cursor.fetchall()
    conn.close()
    return [r[0] for r in hash]
def delete_certificate(credential_id):
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Certificates WHERE certificateID = ?",
                   (credential_id,))
    conn.commit()
    conn.close()
    merkleRoot()
def merkleRoot():
    global current_root
    conn = sqlite3.connect('Certificates.db')
    cursor = conn.cursor()
    cursor.execute("SELECT hash FROM Certificates")
    Data = cursor.fetchall()
    hashes=[r[0] for r in Data]
    current_root=merkle_tree_create(hashes)



