from flask import Flask, request
from hash import hash_generation
from MerkleTreeApplication import merkle_tree_create
from database import *
from datetime import datetime

app = Flask(__name__)


@app.route("/")
def home():
    return "SecureCert backend running"


@app.route("/input", methods=["POST"])
def input_details():

    credential_id = request.form["credential_id"]
    name = request.form["name"]
    designation = request.form["designation"]
    course = request.form["course"]
    year = int(request.form["year"])
    expiry = request.form["expiry"]

    if expiry == "":
        expiry = None
    else:
        try:
            expiry = datetime.strptime(expiry, "%Y-%m-%d").date()
            expiry=str(expiry)
        except ValueError:
            return "Invalid date format"

    certificate = {
        "credential_id": credential_id,
        "name": name,
        "designation": designation,
        "course": course,
        "year": year,
        "expiry": expiry
    }

    cert_hash = hash_generation(certificate)
    certificate["hash"] = cert_hash

    insert_certificate(certificate)

    return "Certificate created"


@app.route("/verify", methods=["POST"])
def verification():

    credential_id = request.form["credential_id"]

    certificate = get_certificate(credential_id)

    if certificate is None:
        return "Certificate not found"

    data = {
        "credential_id": certificate[0],
        "name": certificate[1],
        "designation": certificate[2],
        "course": certificate[3],
        "year": certificate[4],
        "expiry": certificate[5]
    }

    new_hash = hash_generation(data)

    if new_hash == certificate[6]:
        return "Certificate verified"
    else:
        return "TAMPERED"


@app.route("/delete", methods=["POST"])
def deletion():

    credential_id = request.form["credential_id"]

    certificate = get_certificate(credential_id)

    if certificate is None:
        return "Certificate not found"

    delete_certificate(credential_id)

    return "Certificate deleted"


@app.route("/merkle")
def show_merkle_root():

    hashes = get_certificate_hash()

    if not hashes:
        return "No certificates found"

    root = merkle_tree_create(hashes)

    return f"Merkle Root: {root}"


if __name__ == "__main__":
    app.run(port=5000, debug=True)