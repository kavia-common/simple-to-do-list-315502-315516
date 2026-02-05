import React, { useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * Simple ID generator for local-only todo items.
 * This avoids extra dependencies.
 */
function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
function App() {
  /** App state: local-only todo list (no backend/auth per work item). */
  const [todos, setTodos] = useState(() => [
    { id: createId(), text: "Add a task ✨", createdAt: Date.now() },
    { id: createId(), text: "Edit a task using the Edit button", createdAt: Date.now() + 1 },
    { id: createId(), text: "Delete tasks you no longer need", createdAt: Date.now() + 2 },
  ]);

  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const newInputRef = useRef(null);
  const editInputRef = useRef(null);

  const editingTodo = useMemo(
    () => (editingId ? todos.find((t) => t.id === editingId) : null),
    [editingId, todos]
  );

  // PUBLIC_INTERFACE
  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => [{ id: createId(), text: trimmed, createdAt: Date.now() }, ...prev]);
    setNewText("");
    // Keep flow fast: focus remains in the input for quick entry.
    newInputRef.current?.focus();
  };

  // PUBLIC_INTERFACE
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    // Focus edit input after it renders.
    window.requestAnimationFrame(() => editInputRef.current?.focus());
  };

  // PUBLIC_INTERFACE
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // PUBLIC_INTERFACE
  const saveEdit = () => {
    const trimmed = editingText.trim();
    if (!editingId) return;

    // If user clears the text, do not save empty tasks.
    if (!trimmed) return;

    setTodos((prev) => prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t)));
    setEditingId(null);
    setEditingText("");
  };

  // PUBLIC_INTERFACE
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    // If deleting the currently edited todo, exit edit mode.
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="App">
      <main className="todo-page" aria-label="Todo app">
        <section className="todo-card" aria-label="Todo list">
          <header className="todo-header">
            <div className="todo-titleWrap">
              <h1 className="todo-title">Todo</h1>
              <p className="todo-subtitle">Add, edit, and delete tasks.</p>
            </div>
            <div className="todo-badge" aria-label="Theme badge">
              Hot Pink
            </div>
          </header>

          <form
            className="todo-add"
            onSubmit={(e) => {
              e.preventDefault();
              addTodo(newText);
            }}
            aria-label="Add a new task"
          >
            <label className="srOnly" htmlFor="newTodo">
              New task
            </label>
            <input
              id="newTodo"
              ref={newInputRef}
              className="todo-input"
              value={newText}
              placeholder="Write a task and press Enter…"
              onChange={(e) => setNewText(e.target.value)}
              autoComplete="off"
            />
            <button className="btn btnPrimary" type="submit">
              Add
            </button>
          </form>

          {editingId && (
            <section className="todo-edit" aria-label="Edit task panel">
              <div className="todo-editHeader">
                <div className="todo-editTitle">
                  Editing: <span className="todo-editTaskName">{editingTodo?.text ?? "Task"}</span>
                </div>
              </div>

              <div className="todo-editBody">
                <label className="srOnly" htmlFor="editTodo">
                  Edit task text
                </label>
                <input
                  id="editTodo"
                  ref={editInputRef}
                  className="todo-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") cancelEdit();
                  }}
                />

                <div className="todo-editActions">
                  <button className="btn btnSuccess" type="button" onClick={saveEdit}>
                    Save
                  </button>
                  <button className="btn btnGhost" type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
                <p className="todo-hint">Tip: Press Esc to cancel editing.</p>
              </div>
            </section>
          )}

          <ul className="todo-list" aria-label="Tasks">
            {todos.length === 0 ? (
              <li className="todo-empty" aria-label="No tasks">
                No tasks yet. Add your first one above.
              </li>
            ) : (
              todos.map((todo) => {
                const isEditing = todo.id === editingId;
                return (
                  <li key={todo.id} className={`todo-item ${isEditing ? "isEditing" : ""}`}>
                    <div className="todo-itemText" title={todo.text}>
                      {todo.text}
                    </div>

                    <div className="todo-itemActions" aria-label={`Actions for task: ${todo.text}`}>
                      <button
                        className="btn btnSecondary"
                        type="button"
                        onClick={() => startEdit(todo)}
                        disabled={isEditing}
                      >
                        Edit
                      </button>
                      <button className="btn btnDanger" type="button" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <footer className="todo-footer" aria-label="Todo stats">
            <div className="todo-count">
              <span className="todo-countNumber">{todos.length}</span> task{todos.length === 1 ? "" : "s"}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
