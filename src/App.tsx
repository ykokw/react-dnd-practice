import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// extern.d.ts追加したけどうまくいかない。。。
// @ts-ignore
import withScrolling from "react-dnd-scrolling";

import "./App.css";
import Card from "./Card";

const ScrollComponent = withScrolling('div');

function App() {
  const [items, setItems] = useState(
    [...Array(30).keys()].map((i) => ({ id: i + 1, label: `item${i + 1}` }))
  );

  const onHoverItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = items[dragIndex];
      const newItems = [...items];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragCard);
      setItems(newItems);
    },
    [items]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <ScrollComponent
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
            {items.map((item, i) => (
              <Card
                key={item.id}
                id={item.id}
                index={i}
                label={item.label}
                onHoverItem={onHoverItem}
              />
            ))}
          </ul>
        </ScrollComponent>
      </div>
    </DndProvider>
  );
}

export default App;
