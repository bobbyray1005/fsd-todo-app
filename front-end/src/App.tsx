import { useEffect, useState } from "react";

interface Todo {
  id: number,
  item: String
}

function App() {

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateItem, setUpdateItem] = useState("");
  const [updateId, setUpdateId] = useState(0);

  // delete the todo from the server and update the todos on the system
  const deleteTodo = async (id: number) => {
    setLoading(true);
    const delres = await fetch("http://localhost:3000/delete/"+id, { method: "delete" });
    const jsonres = await delres.json();
    setTodos(jsonres["todoItems"]);
    setLoading(false);
  } 

  const addTodo = async (item: String) => {
    setLoading(true);
    const addres = await fetch("http://localhost:3000/add",{
      method: "post",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        item
      })
    })
    const jsonres = await addres.json();
    setTodos(jsonres["todoItems"])
    setLoading(false);
  }

  const startUpdateTodo = (id: number) => {
    setUpdate(true);
    setUpdateId(id);
  }

  const completeUpdateTodo = async () => {
    setLoading(true);
    const updateres = await fetch("http://localhost:3000/update",{
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "id" : updateId,
        "item" : updateItem
      })
    });
    const jsonres = await updateres.json();
    setTodos(jsonres["todoItems"]);

    setLoading(false);
  }

  useEffect(()=>{
    // fetch the todo items
    setLoading(true);
    fetch("http://localhost:3000/get").then(res=>res.json()).then((todos) => {
      setTodos(todos["todoItems"]);
    })
    setLoading(false)
  }, [])

  return (
    <section>
      {loading? <div>Loadin..</div>:""}
      {update? (<section>
        <h3>{updateId}</h3>
        <input type="text" value={updateItem} onChange={(e)=>setUpdateItem(e.target.value)}/>
        <input type="submit" value="update" onClick={()=>completeUpdateTodo()} />
      </section>):""}
      <div className="input-section">
        <input type="text" name="todo-item" id="todo-item" value={newItem} onChange={e=>setNewItem(e.target.value)}/>
        <input type="submit" value="add" onClick={()=>addTodo(newItem)}/>
      </div>
      <div className="todos">
        {todos.map((todo:Todo)=>(
          <div className="todo" key={todo.id} >
            <span>{todo.item}</span>
            <button onClick={()=>deleteTodo(todo.id)} >Delete</button>
            <button onClick={()=>startUpdateTodo(todo.id)} >Update</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default App
