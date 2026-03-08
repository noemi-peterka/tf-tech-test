// src/App.tsx
// This is your starting point. Build out the UI here.
// You're welcome to split this into multiple components if you'd like!

import { useState, useEffect } from "react";
import { Task } from "./types";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  const [formError, setFormError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Fetch tasks on mount
  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError(null);

        const completed =
          statusFilter === "all" ? undefined : statusFilter === "completed";

        const priority = priorityFilter === "all" ? undefined : priorityFilter;

        const data = await getTasks({ completed, priority });
        setTasks(data);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, [statusFilter, priorityFilter]);

  // TODO: Customise this — add priority, due dates, or anything else you like!
  const handleAddTask = async () => {
    setFormError(null);

    if (!newTaskTitle.trim()) {
      setFormError("Please enter a task title.");
      return;
    }

    try {
      const task = await createTask({
        title: newTaskTitle,
        completed: false,
        priority: newTaskPriority,
      });

      setTasks((prev) => [...prev, task]);
      setNewTaskTitle("");
      setNewTaskPriority("medium");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create task.",
      );
    }
  };

  // TODO: Expand this if you add extra fields to update
  const handleToggleComplete = async (task: Task) => {
    const updated = await updateTask(task.id, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // TODO: Add a confirmation step, or an undo feature if you like!
  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Task Manager</h1>

      {/* TODO: Improve this input — add priority, labels, due date, etc. */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <select
          value={newTaskPriority}
          onChange={(e) =>
            setNewTaskPriority(e.target.value as "low" | "medium" | "high")
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAddTask}>Add</button>
      </div>

      {formError && <p style={{ color: "red" }}>{formError}</p>}

      {/* TODO: Style this list — make it your own! */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "completed")
          }
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value as "all" | "low" | "medium" | "high",
            )
          }
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {task.title}({task.priority})
              </span>
              <button onClick={() => handleToggleComplete(task)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
