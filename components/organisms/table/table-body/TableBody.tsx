import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, arrayMove, useSortable } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { useRef } from "react";
import TableRow from "./table-row/TableRow";

export default function TableBody({
  data,
  factory,
  handlers,
}: {
  data: DataItem[];
  factory: Factory<TableProps>;
  handlers: {
    updateCell: (items: UpdatedItem | UpdatedItem[]) => Promise<void>;
    reorder: (rangedItems: DataItem[], direction: "up" | "down") => void;
  }
}) {
  const bodyRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sourceIndex = data.findIndex((item, index) => index === active.id);
    const targetIndex = data.findIndex((item, index) => index === over.id);

    const direction = sourceIndex < targetIndex ? "up" : "down";


    handlers.reorder(data.slice(Math.min(sourceIndex, targetIndex),
      Math.max(sourceIndex, targetIndex) + 1), direction);
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={data.map((item, index) => index)}>
        <div className="table-body flex-grow text-gray-800" ref={bodyRef}>
          {data.map((item, index) => (
            <DraggableRow
              key={item.id}
              item={item}
              index={index}
              attrsByName={factory.attrsByName}
              style={factory.style}
              onUpdate={handlers.updateCell}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function DraggableRow({
  item,
  index,
  attrsByName,
  style,
  onUpdate,
}: {
  item: DataItem;
  index: number;
  attrsByName: AttrsByName;
  style: TableStyle;
  onUpdate: (items: UpdatedItem | UpdatedItem[]) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const dragStyles = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transition || undefined,
    border: isDragging ? '1px solid #4672b0' : 'none',
  };

  return (
    <div
      id={`table-row-container-${index}`}
      ref={setNodeRef}
      style={{ ...dragStyles, borderRadius: '5px' }}
      {...attributes}
    >
      <TableRow
        item={item}
        attrsByName={attrsByName}
        onUpdate={onUpdate}
      />
    </div>
  );
}
