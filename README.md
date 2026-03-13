# SecureCert
SecureCert — Cryptographic Certificate Verification System
SecureCert is a certificate issuance and verification system that ensures certificate integrity using cryptographic hashing and Merkle trees.
The system allows organizations to:
    Issue certificates
    Verify certificate authenticity
    Detect tampering
    Remove certificates
    Compute a global integrity proof using a Merkle root

The project is built with:
    Flask for the backend API
    Next.js for the frontend interface
    SQLite for storage
    SHA-256 hashing
    Merkle Tree integrity verification

Features
    Issue new certificates
    Verify certificate authenticity
    Detect tampering via cryptographic hash
    Delete certificates
    Compute global Merkle root
    Modern web UI
    API-based backend architecture

To run locally:
First clone the app into the local system.

Backend Setup
    Install Python dependencies:
        pip install -r requirements.txt
    Run the backend server:
        python APPMain.py
    The backend will start at:
        http://localhost:5000

Frontend Setup
    Navigate to the frontend folder:
        cd frontend
    Install Node dependencies:
        npm install
    Run the development server:
        npm run dev
    The frontend will start at:
        http://localhost:3000