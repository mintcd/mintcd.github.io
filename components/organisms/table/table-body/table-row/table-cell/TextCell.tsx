import Latex from "@components/atoms/latex";
import TextField from "@components/atoms/text-field"

export default function TextCell({
  itemId,
  attr,
  value,
  onUpdate,
  focused
}: {
  itemId: number;
  attr: AttrProps;
  value: string;
  onUpdate: (items: UpdatedItem) => void;
  focused?: boolean;
}) {
  function handleUpdate(value: string) {
    onUpdate({
      id: itemId,
      attrValue: { [attr.name]: value }
    })
  }

  return (
    focused
      ? <TextField
        value={String(value)}
        onSubmit={handleUpdate}
      />
      : <Latex>{value}</Latex>
  );
}
