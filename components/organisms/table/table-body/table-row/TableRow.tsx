import TableCell from "./table-cell";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { DragIndicatorOutlined, UnfoldMoreRounded, UnfoldLessRounded } from "@mui/icons-material";
import TextCell from "./table-cell/TextCell";
import { Divider } from "@mui/material";

import "../../table.css"

export default function TableRow({ item, attrsByName, onUpdate, style, listeners }:
  {
    item: DataItem,
    attrsByName: AttrsByName,
    onUpdate: (items: UpdatedItem | UpdatedItem[]) => Promise<void>,
    style?: {
      optionsColumnWidth?: number,
      cellMinWidth?: number
    },
    listeners?: any
  }
) {

  const attrs = Object.values(attrsByName)

  const regularAttrs = attrs.filter(attr => attr.newWindow === false && attr.hidden === false)
  const expandedAttrs = attrs.filter(attr => attr.newWindow === true)

  const [hovered, setHovered] = useState(false);
  const [focusedCell, setFocusedCell] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null); // Track which item is being dragged

  const ref = useClickAway(() => {
    setFocusedCell(-1);
  }) as any;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && focusedCell !== -1 && focusedCell !== attrs.length - 1) {
        e.preventDefault();
        setFocusedCell((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress); // Cleanup
    };
  }, [focusedCell, attrs.length]); // Add dependencies

  return (
    <div
      className={`table-row ${draggedOver && 'border-2 border-blue-400'} transition-all duration-200 ease-in-out`} // Smooth visual feedback for dragging
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      <div
        key={item.id}
        className={`regular-cell-group grid py-[10px] hover:border-gray-300`}
        style={{
          gridTemplateColumns: [`${style?.optionsColumnWidth || 100}px`,
          ...regularAttrs.sort((x, y) => x.order - y.order).map((attr) => `${Math.max(attr.width || 0)}px`)].join(' '),
        }}
      >
        <div className="flex justify-end">
          {hovered && (
            <div className="p-2">
              <span
                className={`${draggingItemId === item.id ? 'opacity-50' : 'opacity-100'} transition-opacity`}
              >
                <DragIndicatorOutlined className="icon hover:cursor-grab" {...listeners} />
              </span>

              {attrs.some(attr => attr.newWindow) && (
                !expanded ? (
                  <UnfoldMoreRounded
                    className="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent drag event
                      setExpanded(true);
                    }}
                  />
                ) : (
                  <UnfoldLessRounded
                    className="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent drag event
                      setExpanded(false);
                    }}
                  />
                )
              )}

            </div>
          )}
        </div>

        {/* Regular Cells */}
        {regularAttrs.sort((x, y) => x.order - y.order).map((attr, index) => (
          <TableCell
            key={`table-cell-${item.id}-${index + 1}`}
            itemId={item.id}
            attr={attr}
            value={item[attr.name]}
            suggestions={attr.suggestions}
            onUpdate={onUpdate}
            focused={focusedCell === index}
            onClick={() => setFocusedCell(index)}
          />

        ))}
      </div>

      <div
        className={`expand-window transition-[max-height] duration-500 ease-in-out overflow-hidden rounded-md ml-[100px] mr-[50px]
          ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`} // Smoothly transitions between expanded and collapsed states
      >
        {expandedAttrs.map((attr, index) => (
          <div className="my-2" key={attr.name}>
            <span className="text-[16px] font-bold">{attr.display}</span>
            <TextCell itemId={item.id} attr={attr} value={item[attr.name]} onUpdate={onUpdate} />
            {index < expandedAttrs.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
}
