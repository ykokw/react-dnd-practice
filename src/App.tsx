import React, { useState, useCallback, useRef } from "react";
import { DndProvider, useDragLayer, XYCoord } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Card from "./Card";

type DraggingHandler = (params: { clientOffset: XYCoord | null }) => void;

let intervalId: number = 0;
const DragLayerComponent: React.FC<{ onDragging: DraggingHandler }> = ({
  children,
  onDragging,
}) => {
  const { isDragging, clientOffset } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset(),
    })
  );
  if (!isDragging) {
    clearInterval(intervalId);
    intervalId = 0;
  }
  if (isDragging) {
    clearInterval(intervalId);
    intervalId = window.setInterval(
      () =>
        onDragging({
          clientOffset,
        }),
      10
    );
  }

  return (
    <ul
      className="card-list"
      style={{
        padding: "4px",
      }}
    >
      {children}
    </ul>
  );
};

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

  const wrapperRef = useRef<HTMLDivElement>(null);

  const onDragging: DraggingHandler = ({ clientOffset }) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { top, bottom } = rect;
    if (
      clientOffset &&
      clientOffset.y > top &&
      clientOffset.y - top < 70 &&
      clientOffset.y - top > 0
    ) {
      if (wrapperRef !== null && wrapperRef.current !== null) {
        wrapperRef.current.scrollTo({
          top: wrapperRef.current.scrollTop - 3,
        });
      }
    }
    if (
      clientOffset &&
      clientOffset.y < bottom &&
      bottom - clientOffset.y < 70 &&
      bottom - clientOffset.y > 0
    ) {
      if (wrapperRef !== null && wrapperRef.current !== null) {
        wrapperRef.current.scrollTo({
          top: wrapperRef.current.scrollTop + 3,
        });
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div
          ref={wrapperRef}
          className="wrapper"
          style={{
            width: "300px",
            height: "600px",
            overflowY: "scroll",
            margin: "16px",
          }}
        >
          <DragLayerComponent onDragging={onDragging}>
            {items.map((item, i) => (
              <Card
                key={item.id}
                id={item.id}
                index={i}
                label={item.label}
                onHoverItem={onHoverItem}
              />
            ))}
          </DragLayerComponent>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
