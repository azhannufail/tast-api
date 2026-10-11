from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskIn(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: str
    done: bool


@app.get("/")
def home():
    return {"message": "Hello, my first API!"}


@app.get("/tasks")
def get_tasks():
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT id, title, done FROM tasks ORDER BY id"))
        return [{"id": r.id, "title": r.title, "done": r.done} for r in rows]


@app.post("/tasks", status_code=201)
def create_task(task: TaskIn):
    with engine.begin() as conn:
        row = conn.execute(
            text("INSERT INTO tasks (title) VALUES (:title) RETURNING id, title, done"),
            {"title": task.title},
        ).one()
        return {"id": row.id, "title": row.title, "done": row.done}


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    with engine.begin() as conn:
        row = conn.execute(
            text(
                "UPDATE tasks SET title = :title, done = :done "
                "WHERE id = :id RETURNING id, title, done"
            ),
            {"title": task.title, "done": task.done, "id": task_id},
        ).one_or_none()
        if row is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"id": row.id, "title": row.title, "done": row.done}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    with engine.begin() as conn:
        result = conn.execute(
            text("DELETE FROM tasks WHERE id = :id"), {"id": task_id}
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted"}