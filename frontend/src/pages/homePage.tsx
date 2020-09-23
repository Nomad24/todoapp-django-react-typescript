import React, { useState, useRef, useEffect, useCallback } from "react";
import "../App.css";

const HomePage: React.FC = () => {
  const [todo, setTodo] = useState([]);
  const [id, setId] = useState(null);
  const [edit, setEdit] = useState(false);
  
  const ref = useRef<HTMLInputElement>(null);
  
  function getCookie(name: string) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const fetchLists = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/task-list/");
      const data = await response.json();
      console.log(data);
      setTodo(data);
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const clearState = () => {
    ref.current!.value = "";
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const csrftoken = getCookie("csrftoken");

      let url: any = "/api/task-create/";

      if (edit == true) {
        url = `/api/task-update/${id}/`;
        setEdit(false);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken!,
        },
        body: JSON.stringify({
          id: null,
          title: ref.current!.value,
          completed: false,
        }),
      });
      const data = await response.json();
      console.log(data);
      fetchLists();
      clearState();
    } catch (error) {
      alert(error);
    }
  };

  const editing = (name: any) => {
    setId(name.id);
    setEdit(true);
    ref.current!.value = name.title;
  };

  const deleteItem = async (name: any) => {

    const csrftoken = getCookie("csrftoken");

    const response = await fetch( `/api/task-delete/${name.id}/`,{
      method: "DELETE",
      headers: {
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken!,
      },
    });
    const data = await response.json();
    console.log(data);
    fetchLists();
  }

  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form onSubmit={handleSubmit} id="form">
            <div className="flex-wrapper">
              <div style={{ flex: 6 }}>
                <input
                  className="form-control"
                  id="title"
                  ref={ref}
                  type="text"
                  name="title"
                  placeholder="Add task.."
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  id="submit"
                  className="btn btn-warning"
                  type="submit"
                  name="Add"
                />
              </div>
            </div>
          </form>
        </div>
        <div id="list-wrapper">
          {todo.map((todo: any, index: number) => {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <div style={{ flex: 7 }}>
                  {todo.completed == false ? (
                    <span>{todo.title}</span>
                  ) : (
                    <span>{todo.title}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <button onClick={() => {editing(todo)}} className="btn btn-sm btn-outline-info">Edit</button>
                </div>

                <div style={{ flex: 1 }}>
                  <button onClick={() => {deleteItem(todo)}} className="btn btn-sm btn-outline-dark delete">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
