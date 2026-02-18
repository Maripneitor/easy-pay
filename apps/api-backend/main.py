from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from typing import List, Dict, Any

app = FastAPI()

# Configurar CORS para permitir que el Frontend (puerto 5173) nos hable
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"groups": []}
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {"groups": []}

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

@app.get("/")
def read_root():
    return {"mensaje": "Hola desde el Hexágono Backend con FastAPI 🐍"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Backend"}

@app.get("/api/groups")
def get_groups():
    data = load_data()
    return data["groups"]

@app.post("/api/groups")
def create_group(group: Dict[Any, Any] = Body(...)):
    data = load_data()
    data["groups"].append(group)
    save_data(data)
    return {"status": "success", "group": group}

@app.delete("/api/groups")
def clear_groups():
    if os.path.exists(DATA_FILE):
        os.remove(DATA_FILE)
    return {"status": "cleared"}
