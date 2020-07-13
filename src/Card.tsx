import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
// import { XYCoord } from "dnd-core";

const ItemType = "card" as const;

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const Card: React.FC<{
  id: number;
  label: string;
  index: number;
  onHoverItem: (dragIndex: number, hoverIndex: number) => void;
}> = ({ id, label, index, onHoverItem }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // dropした要素のDOMRectオブジェクト取得(top / left / right / bottom / width / height etc...)
      // https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // hoverしたアイテムのheight / 2
      // TODO: rect.heightでもいける。。。？
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // ドラッグ中のポインタ座標
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // ホバーしたアイテムの高さの半分以上をhoverしたときだけitemを動かす
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onHoverItem(dragIndex, hoverIndex);

      // TODO: ちょっとなんのことかわからない...
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemType, id, index }, // DragItem
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return (
    <li
      ref={ref}
      onClick={() => console.log(index)}
      style={{
        opacity,
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
      {label}
    </li>
  );
};

export default Card;
