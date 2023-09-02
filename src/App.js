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

  const handleSavedData = () => {
    const savedData = JSON.parse(localStorage.getItem("savedListItems"));
    if (savedData) {
      setTodoList(savedData);
    } else {
      localStorage.setItem("savedListItems", JSON.stringify(todoList));
    }
  };

  const handleApi = () => {
    axios
      .get(`https://dummyjson.com/todos?limit=20&skip=${skip}`)
      .then((res) => {
        const listItems = res.data.todos;
        setTodoList((prev) => {
          return [...prev, ...listItems];
        });
        setItemsCount((prev) => prev + listItems.length);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // handleSavedData();
    handleApi();
  }, [skip]);

  const addItem = () => {
    const value = inputRef.current.value;
    console.log(value);
    if (value === "") return;
    setTodoList((prev) => {
      console.log(value);
      // const x = [...prev, { todo: value}];
      return[...prev, { todo: value }];
    });
    setItemsCount((prev) => prev + 1);
    inputRef.current.value = "";
  };

  return (
    <div>
      <h1>To Do </h1>
      <h2>Total items: {itemsCount}</h2>
      <div className="search-bar-div">
        <input type="text" placeholder="enter list item" ref={inputRef}></input>
        <button className="add-button" onClick={addItem}>
          ADD
        </button>
      </div>
      <ul>
        {todoList.map((item, index) => {
          return (
            <li className="list-item" key={index}>
              {item.todo}
              <button>Delete</button>
              <hr />
            </li>
          );
        })}
      </ul>
      {itemsCount < itemsLength && (
        <button className="load-button" onClick={() => setSkip(skip + 20)}>
          Load More
        </button>
      )}
    </div>
  );
}

export default App;
