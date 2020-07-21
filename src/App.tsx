import React, { useState, useCallback, useRef } from "react";
import { DndProvider, useDragLayer, XYCoord } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Card from "./Card";

type DraggingHandler = (params: {
  isDragging: boolean;
  clientOffset: XYCoord | null;
  sourceClientOffset: XYCoord | null;
}) => void;

let intervalId: number = 0;
const DragLayerComponent: React.FC<{ onDragging: DraggingHandler }> = ({
  children,
  onDragging,
}) => {
  const { isDragging, clientOffset, sourceClientOffset } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset(),
      sourceClientOffset: monitor.getSourceClientOffset(),
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
          isDragging,
          clientOffset,
          sourceClientOffset,
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

  const onDragging: DraggingHandler = ({
    isDragging,
    clientOffset,
    sourceClientOffset,
  }) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { top, bottom } = rect;
    console.log(`isDragging: ${isDragging}`);
    console.log(`clientOffset: ${JSON.stringify(clientOffset)}`);
    console.log(`sourceOffset: ${JSON.stringify(sourceClientOffset)}`);
    console.log(`top: ${top}`);
    console.log(`bottom: ${bottom}`);
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
      console.log("near to the top");
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
      console.log("near to the bottom");
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
