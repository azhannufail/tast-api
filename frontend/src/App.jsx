import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

function TaskItem(props) {
  return (
    <li>
      <input type="checkbox" checked={props.done} onChange={props.onToggle} />
      <span style={{ textDecoration: props.done ? "line-through" : "none" }}>
        {props.title}
      </span>
      <button onClick={props.onDelete}>Delete</button>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  function addTask() {
    if (newTitle.trim() === "") return;

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        setTasks([...tasks, createdTask]);
        setNewTitle("");
      });
  }

  function toggleTask(task) {
    fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, done: !task.done }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      });
  }

  function deleteTask(id) {
    fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" }).then((res) => {
      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    });
  }

  return (
    <div>
      <h1>My Tasks</h1>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t) => (
          <TaskItem
            key={t.id}
            title={t.title}
            done={t.done}
            onToggle={() => toggleTask(t)}
            onDelete={() => deleteTask(t.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;