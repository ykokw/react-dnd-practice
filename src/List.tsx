import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const List = () => {
  const [items, setItems] = useState(
    [...Array(30).keys()].map((i) => ({ id: i + 1, label: `item${i + 1}` }))
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return;
      const dragCard = items[source.index];
      const newItems = [...items];
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, dragCard);
      setItems(newItems);
    },
    [items]
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
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
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        width: "280px",
                        height: "80px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        margin: "4px auto",
                        listStyle: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.label}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default List;
