import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, arrayMove, useSortable } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { useRef } from "react";
import TableRow from "./table-row/TableRow";

export default function TableBody({
  paginatedData,
  attrsByName,
  style,
  onUpdateCell,
  onReorder,
}: {
  paginatedData: DataItem[];
  attrsByName: AttrsByName;
  style: TableStyle;
  onUpdateCell: (items: UpdatedItem | UpdatedItem[]) => Promise<void>;
  onReorder: (rangedItems: DataItem[], direction: "up" | "down") => void;
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

    const sourceIndex = paginatedData.findIndex((item, index) => index === active.id);
    const targetIndex = paginatedData.findIndex((item, index) => index === over.id);

    const direction = sourceIndex < targetIndex ? "up" : "down";


    onReorder(paginatedData.slice(Math.min(sourceIndex, targetIndex),
      Math.max(sourceIndex, targetIndex) + 1), direction);
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={paginatedData.map((item, index) => index)}>
        <div className="table-body flex-grow text-gray-800" ref={bodyRef}>
          {paginatedData.map((item, index) => (
            <DraggableRow
              key={item.id}
              item={item}
              index={index}
              attrsByName={attrsByName}
              style={style}
              onUpdate={onUpdateCell}
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
        style={style}
        onUpdate={onUpdate}
        listeners={listeners}
      />
    </div>
  );
}
