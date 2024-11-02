import { AtomProps } from "./types";
import { Selection } from "./types";
import Latex from "@components/atoms/latex";

export default function Atom({ id, props, selection }: {
  id: number,
  props: AtomProps,
  selection?: Selection
}) {

  if (selection === undefined || selection.from === undefined || selection.to === undefined) {
    return props.text
  }


  if (props.type === 'latex' && selection.from.id != id) {
    return <Latex>{props.text}</Latex>
  }

  // Selection is all inside the atom
  if (selection.from.id === id && selection.to.id === id) {
    const start = selection.from.offset
    const end = selection.to.offset

    // Render a caret
    if (start === end) {
      return (
        <>
          {props.text.slice(0, start)}
          <span style={{ display: 'inline-block', width: '1px', height: '16px', backgroundColor: 'black' }} />
          {props.text.slice(start)}
        </>
      );

    }

    // Render a highlight
    return [
      props.text.slice(0, start),
      <span key="selected" style={{ backgroundColor: 'yellow' }}>
        {props.text.slice(start, end)}
      </span>,
      props.text.slice(end)
    ];


  }
  else if (selection.from.id === id) {
    return [
      props.text.slice(0, selection.from.offset),
      <span key="selected" style={{ backgroundColor: 'yellow' }}>
        {props.text.slice(selection.from.offset)}
      </span>,
    ];

  } else if (selection.to.id === id) {
    return [
      <span key="selected" style={{ backgroundColor: 'yellow' }}>
        {props.text.slice(0, selection.to.offset)}
      </span>,
      props.text.slice(selection.to.offset)
    ];
  } else if (selection.from.id < id && id < selection.to.id) {
    return <span key="selected" style={{ backgroundColor: 'yellow' }}>
      {props.text}
    </span>
  }

  return props.text
}