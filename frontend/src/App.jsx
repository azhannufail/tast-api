import { useState } from "react";

function TaskItem(props) {
  return (
    <li>
      <input type="checkbox" checked={props.done} onChange={props.onToggle} />
      <span style={{ textDecoration: props.done ? "line-through" : "none" }}>
        {props.title}
      </span>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Learn Git", done: true },
    { id: 2, title: "Build an API", done: false },
  ]);
  const [newTitle, setNewTitle] = useState("");

  function addTask() {
    if (newTitle.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), title: newTitle, done: false }]);
    setNewTitle("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
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
            onToggle={() => toggleTask(t.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;