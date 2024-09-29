import Latex from "@components/latex";
import { useClickAway } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

export default function TextCell({
  itemId,
  attr,
  value,
  onUpdate,
}: {
  itemId: number;
  attr: AttrProps;
  value: string;
  onUpdate: (itemId: number, attrName: string, value: string) => void;
}) {
  const [cellState, setCellState] = useState('noEdit');
  const [oldValue, setOldValue] = useState(value);
  const [editingValue, setEditingValue] = useState(value);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const ref = useClickAway(() => {
    if (cellState === 'editing') {
      setCellState('noEdit');
      handleUpdate()
    }
  }) as any;

  function handleUpdate() {
    if (editingValue !== oldValue) {
      onUpdate(itemId, attr.name, editingValue);
      setOldValue(editingValue)
    }
    setCellState("noEdit");
  }

  useEffect(() => {
    if (cellState === 'editing' && textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
      textareaRef.current.focus();
    }
  }, [cellState]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [editingValue]);

  return (
    <div className={`table-text-cell h-full ${attr.name !== 'id' && 'w-full'} overflow-hidden`} ref={ref}>
      {cellState === 'noEdit' && (
        <div
          className="h-full min-h-[1.75rem] flex items-center cursor-pointer"
          onClick={() => {
            setCellState("editing");
            setOldValue(value)
            setEditingValue(value);
          }}
        >
          <Latex>{String(value)}</Latex>
        </div>
      )}
      {cellState === 'editing' && (
        <textarea
          className="h-full w-full p-0 focus:outline-none border-none resize-none bg-inherit"
          ref={textareaRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                e.preventDefault();
                setEditingValue(editingValue + '\n');
              } else {
                handleUpdate()
              }
            }
          }}
        />
      )}
    </div>
  );
}
