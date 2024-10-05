import Latex from "@components/latex";
import { TextField } from "@components/atoms"
import { useClickAway } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { AttrProps } from "../types"

export default function TextCell({
  itemId,
  attr,
  initialValue,
  onUpdate,
  focused,
}: {
  itemId: number;
  attr: AttrProps;
  initialValue: string;
  onUpdate: (itemId: number, attrName: string, value: string) => void;
  focused?: boolean;
}) {
  const [cellState, setCellState] = useState(focused ? 'editing' : 'noEdit')
  const [value, setValue] = useState(initialValue || "");

  const ref = useClickAway(() => {
    if (cellState === 'editing') {
      setCellState('noEdit');
    }
  }) as any;

  function handleUpdate(value: string) {
    onUpdate(itemId, attr.name, value);
    setCellState("noEdit");
  }

  useEffect(() => {
    if (focused) setCellState('editing')
    else setCellState('noEdit')
  }, [focused])

  return (
    <div className={`table-text-cell`} ref={ref}>
      {cellState === 'noEdit' && (
        <div
          className="min-h-[3rem] cursor-pointer"
          onClick={() => {
            setCellState("editing");
            setValue(initialValue);
          }}
        >
          <Latex>{String(initialValue)}</Latex>
        </div>
      )}
      {cellState === 'editing' && (
        <TextField
          initialValue={value}
          onUpdate={handleUpdate}
          type={attr.useLatex ? 'latex' : 'text'}
        />
      )}
    </div>
  );
}
