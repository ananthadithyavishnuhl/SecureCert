from flask import Flask, render_template, request
from hash import hash_generation
from MerkleTreeApplication import hash_add, merkle_tree_create
import hashlib
from database import *

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


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

    certificate = {"credential_id": credential_id,
                   "name": name,
                   "designation": designation,
                   "course": course,
                   "year": year,
                   "expiry": expiry}
    hash = hash_generation(certificate)
    certificate["hash"] = hash
    insert_certificate(certificate)
    return "Certificate created"


@app.route("/verify", methods=["POST"])
def verification():
    credential_id = request.form["credential_id"]
    certificate = get_certificate(credential_id)
    if certificate == None:
        return "Certificate not found"
    data = {"credential_id": certificate[0],
            "name": certificate[1],
            "designation": certificate[2],
            "course": certificate[3],
            "year": certificate[4],
            "expiry": certificate[5]
            }
    hash = hash_generation(data)
    if hash == certificate[6]:
        return "Certificate verified"
    else:
        return "Certificate not verified, \n....................TAMPERED......................."


@app.route("/delete", methods=["POST"])
def deletion():
    try:
        credential_id = request.form["credential_id"]
        delete_certificate(credential_id)
        return "Certificate deleted"
    except:
        return "Certificate not found"



@app.route("/merkle")
def show_merkle_root():
    hashes = get_certificate_hash()
    root = merkle_tree_create(hashes)
    return f"Merkle Root: {root}"



if __name__ == "__main__":
    app.run(debug=True)