from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# CORS Setup: allows frontend (even from another port) to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with your frontend domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load users from users.json
def load_users():
    try:
        with open("users.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

# Load tasks from tasks.json
def get_tasks():
    try:
        with open("tasks.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Get data for a specific user
@app.get("/user/{username}")
async def get_user(username: str):
    users = load_users()
    if username in users:
        return users[username]
    else:
        raise HTTPException(status_code=404, detail="User not found")

# Get all available tasks
@app.get("/tasks")
async def tasks():
    tasks = get_tasks()
    return tasks