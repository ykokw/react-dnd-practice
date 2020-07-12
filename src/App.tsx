import React from "react";
import "./App.css";
import Card from "./Card";

function App() {
  const items = [...Array(30).keys()].map((i) => `item${i}`);
  return (
    <div className="app">
      <div
        className="wrapper"
        style={{
          width: "300px",
          height: "600px",
          overflowY: "scroll",
          margin: "64px",
        }}
      >
        <ul
          className="card-list"
          style={{
            padding: "0",
          }}
        >
          {items.map((item) => (
            <Card key={item} label={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
