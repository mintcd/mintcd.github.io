import TableCell from "@components/table/table-cell";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { DragIndicatorOutlined, UnfoldMoreRounded, UnfoldLessRounded } from "@mui/icons-material";
import TextCell from "../table-cell/TextCell";
import { Divider } from "@mui/material";

export default function TableRow({ item, attrs, onUpdate, onExchangeItems }:
  {
    item: DataItem,
    attrs: AttrProps[],
    onUpdate: (itemId: number, attr: string, value: string | string[]) => void,
    onExchangeItems: (id1: number, id2: number) => void,
  }
) {
  const [hovered, setHovered] = useState(false);
  const [focusedCell, setFocusedCell] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null); // Track which item is being dragged
  const ref = useClickAway(() => {
    setFocusedCell(-1);
    setExpanded(false)
  }) as any;

  // Handlers
  const handleDragStart = (e: React.DragEvent<HTMLElement>, id: number) => {
    e.dataTransfer.setData('draggedItemId', id.toString()); // Store the dragged item's id in the dataTransfer object
    setDraggingItemId(id); // Track the dragged item
  };

  const handleDragEnd = () => {
    setDraggingItemId(null); // Reset dragging item when drag ends
    setDraggedOver(false); // Reset the drag-over state
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetId: number) => {
    e.preventDefault();
    setDraggedOver(false);
    const draggedItemId = parseInt(e.dataTransfer.getData('draggedItemId'), 10); // Retrieve the dragged item's id
    if (draggedItemId !== targetId) {
      onExchangeItems(draggedItemId, targetId); // Call the provided function to exchange items
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault(); // Allow the drop event to occur
    if (!draggedOver) {
      setDraggedOver(true); // Set drag-over state only when it's not already set
    }
  };

  return (
    <div
      className={`table-row ${draggedOver && 'border-2 border-blue-400'} transition-all duration-200 ease-in-out`} // Smooth visual feedback for dragging
      onDrop={(e) => handleDrop(e, item.id)}
      onDragOver={handleDragOver}
      onDragLeave={() => setDraggedOver(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      <div
        key={item.id}
        className={`-table-row grid py-[10px] hover:border-gray-300`}
        style={{
          gridTemplateColumns: ['100px', ...attrs.map((attr) => `${Math.max(attr.width || 0)}px`)].join(' '),
        }}
      >
        <div className="flex items-center justify-end">
          {hovered && (
            <div>
              <span
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd} // Reset dragging state after the drag ends
                className={`${draggingItemId === item.id ? 'opacity-50' : 'opacity-100'} transition-opacity`}
              >
                <DragIndicatorOutlined className="text-[18px] hover:cursor-grab" />
              </span>

              {attrs.some(attr => attr.newWindow) && (
                !expanded ? (
                  <UnfoldMoreRounded
                    className="text-[18px] hover:cursor-pointer"
                    onClick={() => setExpanded(true)}
                  />
                ) : (
                  <UnfoldLessRounded
                    className="text-[18px] hover:cursor-pointer"
                    onClick={() => setExpanded(false)}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Regular Cells */}
        {attrs.filter(attr => !attr.newWindow).map((attr, cellIndex) => (
          <div
            key={cellIndex}
            className={`cell-container px-3 flex items-center justify-between
            transition duration-200
            ${focusedCell === cellIndex ? 'border-2 border-blue-400 shadow-lg' : 'border border-transparent'}`}
            onClick={() => setFocusedCell(focusedCell !== cellIndex ? cellIndex : -1)}
          >
            <TableCell
              itemId={item.id}
              attr={attr}
              value={item[attr.name]}
              suggestions={attr.suggestions}
              onUpdate={onUpdate}
            />
          </div>
        ))}
      </div>

      <div className={`expand-window transition-all duration-300 ease-in-out overflow-hidden rounded-md ml-[100px] mr-[50px] max-h-0
        ${expanded ? 'max-h-[500px] opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'}`}>
        {attrs.filter(attr => attr.newWindow).map(attr => (
          <div className="my-2" key={attr.name}>
            <span className="text-[16px] font-bold">{attr.display}</span>
            <TextCell itemId={item.id} attr={attr} value={item[attr.name]} onUpdate={onUpdate} />
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
}
