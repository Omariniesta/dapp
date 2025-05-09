from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

app = FastAPI()

class TaskUpdate(BaseModel):
    task_id: int
    username: str

@app.get("/tasks")
def get_tasks():
    with open("tasks.json", "r") as file:
        tasks = json.load(file)
    return {"tasks": tasks}

@app.post("/complete_task")
def complete_task(task_update: TaskUpdate):
    with open("tasks.json", "r") as file:
        tasks = json.load(file)

    task_found = next((task for task in tasks if task["id"] == task_update.task_id), None)
    
    if not task_found:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task status
    task_found["status"] = "complete"

    # Save updated tasks
    with open("tasks.json", "w") as file:
        json.dump(tasks, file)

    # Update user points
    with open("users.json", "r") as file:
        users = json.load(file)

    user = next((u for u in users if u["username"] == task_update.username), None)
    
    if user:
        user["points"] += task_found["points"]

    # Save updated user data
    with open("users.json", "w") as file:
        json.dump(users, file)

    return {"message": "Task completed", "points_awarded": task_found["points"]}