import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async e => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/todos`, { title: newTitle });
      setTodos(prev => [...prev, res.data]);
      setNewTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async id => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async id => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          placeholder="Enter new todo"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(todo._id)}>{todo.title}</span>
            <button className="delete" onClick={() => deleteTodo(todo._id)} disabled={loading}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
