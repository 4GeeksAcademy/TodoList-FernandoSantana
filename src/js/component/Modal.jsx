import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function Modal() {
  const [newEntry, setnewEntry] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [taskCompleted, settaskCompleted] = useState(null);
  

  useEffect(() => {
    createUser();
    loadToDos();
  }, []);

  const loadToDos = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/Fernando');
      const result = await response.json();
      setTasks(result.todos);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/Fernando', {
        method: 'POST',
        body: JSON.stringify([]),
        headers: {
          "content-type": "application/json"
        }
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/todos/Fernando', {
        method: 'POST',
        body: JSON.stringify({
          "label": newEntry,
          "is_done": false
        }),
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        }
      });
      const result = await response.json();
      loadToDos();
      setnewEntry("");
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (id, updatedLabel) => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/todos/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          "label": updatedLabel,
          "is_done": false
        }),
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        }
      });
      const result = await response.json();
      loadToDos();
      return result;
    } catch (error) {
      console.log(error + id);
    }
  };

  const handleEdit = (id, label) => {
    setEditingTask(id); 
    setEditedLabel(label); 
  };

  const handleSave = (id) => {
    if (editedLabel.trim()) {
      editTask(id, editedLabel); 
    }
    setEditingTask(null); 
  };

  const deleteTask = async (id) => {
    try {
      await fetch('https://playground.4geeks.com/todo/todos/' + id, {
        method: 'DELETE',
        headers: {
          "content-type": "application/json"
        }
      });
      loadToDos();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await fetch('https://playground.4geeks.com/todo/users/Fernando', {
        method: 'DELETE',
        headers: {
          "content-type": "application/json"
        }
      });
      createUser(); 
      setTasks([]);
    } catch (error) {
      console.log(error);
    }
  };

  const clicked = () => {
    settaskCompleted();
  };
  

  return (

    <div className="inputList d-flex justify-content-center">
      <div className="container">
        <div className="header">
          <h1 className="d-flex justify-content-center">TO DO</h1>
          <br />
          <div className="container">
            <div className="input-group d-flex justify-content-center">
              <input
                className="firstImput"
                value={newEntry}
                onChange={(e) => setnewEntry(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    createTask();
                  }
                }}
                type="text"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={createTask}
              >
                AÑADIR TAREA
              </button>
              <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={deleteAllTasks}
                      >
                       delete all tasks <MdDelete />
                      </button>
            </div>
          </div>
          <ul className="lista align-items-center p-0">

            {tasks.map((task) => (
              <li className="tareas row align-items-end"

                key={task.id}>
                {editingTask === task.id ? (
                  <div className="inputButton d-flex justify-content-center">
                    <input
                      className="inputEdit"
                      type="text"
                      value={editedLabel}
                      onChange={(e) => setEditedLabel(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSave(task.id);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-primary ms-2"
                      onClick={() => handleSave(task.id)}
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                      <button className={`check btn position-absolute ${taskCompleted === 'check' ? 'activo' : ''}`} 
                      onClick={() => clicked('check')}/>
                      
                    <div className="d-flex justify-content-center col-9">                    
                      {task.label}
                    </div>
                    <div className="editDelete col-2 d-flex justify-content-end p-0">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleEdit(task.id, task.label)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => deleteTask(task.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
