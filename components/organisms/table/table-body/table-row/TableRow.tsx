import TableCell from "./table-cell";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { DragIndicatorOutlined, UnfoldMoreRounded, UnfoldLessRounded } from "@mui/icons-material";
import TextCell from "./table-cell/TextCell";
import { Divider } from "@mui/material";

import { IoOpenOutline, IoClose } from "react-icons/io5";

type Props = DefaultComponentProps & {
  item: DataItem,
  attrsByName: AttrsByName,
  onUpdate: (items: UpdatedItem | UpdatedItem[]) => Promise<void>
}


export default function TableRow(props: Props) {
  const { item, attrsByName, onUpdate, listeners } = props;

  const attrs = Object.values(attrsByName)

  const regularAttrs = attrs.filter(attr => attr.newWindow === false && attr.hidden === false)
  const expandedAttrs = attrs.filter(attr => attr.newWindow === true)

  const [hovered, setHovered] = useState(false);
  const [focusedCell, setFocusedCell] = useState(-1);
  const [opened, setOpened] = useState(false);
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
          gridTemplateColumns: [`${75}px`,
          ...regularAttrs.sort((x, y) => x.order - y.order).map((attr) => `${Math.max(attr.width || 0)}px`)].join(' '),
        }}
      >
        {<div className="icon-group flex justify-end items-center">
          {hovered && (
            <div className="flex justify-end items-center">
              <span
                className={`${draggingItemId === item.id ? 'opacity-50' : 'opacity-100'} transition-opacity`}
              >
                <DragIndicatorOutlined className="icon hover:cursor-grab" {...listeners} />
              </span>

              {attrs.some(attr => attr.newWindow) && <IoOpenOutline
                className="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpened(true);
                }}
              />}

            </div>
          )}
        </div>}

        {regularAttrs.sort((x, y) => x.order - y.order).map((attr, index) => (
          <TableCell
            key={`table-cell-${item.id}-${index + 1}`}
            itemId={item.id}
            attr={attr}
            value={item[attr.name]}
            suggestions={attr.suggestions}
            onUpdate={onUpdate}
            focused={focusedCell === index}
            listeners={{
              onClick: () => setFocusedCell(index)
            }}
          />

        ))}
      </div>

      {opened && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Expanded View</h2>
              <IoClose
                className="icon cursor-pointer"
                onClick={() => setOpened(false)}
              />
            </div>
            {expandedAttrs.map((attr, index) => (
              <div className="my-4" key={attr.name}>
                <span className="text-[16px] font-bold">{attr.display}</span>
                <TextCell itemId={item.id} attr={attr} value={item[attr.name]} onUpdate={onUpdate} />
                {index < expandedAttrs.length - 1 && <Divider className="my-4" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
