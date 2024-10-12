import Latex from "@components/latex";
import { TextField } from "@components/atoms"
import { useClickAway } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export default function TextCell({
  itemId,
  attr,
  value,
  onUpdate,
  focused,
}: {
  itemId: number;
  attr: AttrProps;
  value: string;
  onUpdate: (items: UpdatedItem) => void;
  focused?: boolean;
}) {
  const [cellState, setCellState] = useState(focused ? 'editing' : 'noEdit')
  const [editingValue, setEditingValue] = useState(value);

  const ref = useClickAway(() => {
    if (cellState === 'editing') {
      setCellState('noEdit');
    }
  }) as any;

  function handleUpdate(editingValue: string) {
    onUpdate({
      id: itemId,
      attrValue: { [attr.name]: editingValue }
    })
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
          className="min-h-[1.5rem] cursor-pointer"
          onClick={() => {
            setCellState("editing");
            setEditingValue(value);
          }}
        >
          <Latex>{String(value)}</Latex>
        </div>
      )}
      {cellState === 'editing' && (
        <TextField
          value={editingValue}
          onUpdate={handleUpdate}
          type={attr.useLatex ? 'latex' : 'text'}
          preview={(value: string, selection: [number, number]) => <Latex>{String(value)}</Latex>}
          focused={true}
        />

      )}
    </div>
  );
}
