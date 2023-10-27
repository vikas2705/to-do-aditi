import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const inputRef = useRef();
  const [itemsCount, setItemsCount] = useState(0);
  const [todoList, setTodoList] = useState([]);
  const itemsLength = 100;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedListItems"));
    if (savedData) {      
      setTodoList(savedData);
    }else{
      handleApi();
    }
  }, [skip]);

  // useEffect(() => {
  //   handleSavedData();
  // }, []);

  const handleApi = () => {
    axios
      .get(`https://dummyjson.com/todos?limit=20&skip=${skip}`)
      .then((res) => {
        const listItems = res.data.todos;
        setTodoList((prev) => {
          const data = [ ...listItems];
          console.log("previous data", data);
          handleSavedData(data);
          return [...prev, ...listItems];
        });
        setItemsCount((prev) => prev + listItems.length);
      })
      .catch((error) => console.log(error));
  };

  const handleSavedData = (data) => {
    const savedData = JSON.parse(localStorage.getItem("savedListItems"));
    if (savedData) {
      // setTodoList(data)
      // setTodoList(savedData);
      
      localStorage.setItem("savedListItems",JSON.stringify([...savedData, ...data]));
      // setTodoList(savedData);
    }
     else {
      localStorage.setItem("savedListItems",JSON.stringify(data));
    }
  };

  const addItem = () => {
    const value = inputRef.current.value;
    if (value === "") return;
    setTodoList((prev) => {
      // const x = [...prev, { todo: value}];
      // handleSavedData()
      return [...prev, { todo: value, id: new Date().getTime() }];
    });
    setItemsCount((prev) => prev + 1);
    inputRef.current.value = "";
  };

  return (
    <div className="main-body">
      <h1>To Do List</h1>
      <h2>Total items: {itemsCount}</h2>
      <div className="search-bar-div">
        <input
          type="text"
          placeholder="enter list item"
          ref={inputRef}
          className="input-box"
        ></input>
        <button className="add-button" onClick={addItem}>
          +
        </button>
      </div>
      <ul>
        {todoList.map((item, index) => {
          return (
            <li className="list-item" key={item.id}>
              <div style={{ paddingBottom: "3px" }} className="item-text">
                {item.todo}
              </div>
              <span className="li-buttons-container">
                <button className="li-button">Edit</button>
                <button className="li-button">Delete</button>
              </span>
            </li>
          );
        })}
      </ul>
      {itemsCount < itemsLength && (
        <div style={{ textAlign: "center", margin: "15px" }}>
          <button className="load-button" onClick={() => setSkip(skip + 20)}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
