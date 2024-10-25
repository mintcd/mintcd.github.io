'use client';

import { useState } from "react";
import { AtomProps, Selection } from "./types";
import { getCharacterOffsets } from "@functions/text-analysis";
import { useClickAway } from "@uidotdev/usehooks";

export default function Editor({ children }: { children: AtomProps[] }) {
  const [selection, setSelection] = useState<Selection>({
    atomId: undefined,
    range: undefined,
  });




  // Track if the mouse is down
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startSelection, setStartSelection] = useState<number | null>(null);
  const [endSelection, setEndSelection] = useState<number | null>(null);
  const ref = useClickAway(() => selection.atomId !== undefined && setSelection({ atomId: undefined, range: undefined })) as any

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>, child: AtomProps) => {
    setIsMouseDown(true);
    const childRect = e.currentTarget.getBoundingClientRect();
    const childOffsetX = e.clientX - childRect.left;
    const characterOffsets = getCharacterOffsets(child.text);
    const differences = characterOffsets.map(offset => Math.abs(offset - childOffsetX));
    const selectionIndex = differences.indexOf(Math.min(...differences));

    setStartSelection(selectionIndex);
    setEndSelection(selectionIndex);
    setSelection({ atomId: child.id, range: [selectionIndex, selectionIndex] });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>, child: AtomProps) => {
    if (isMouseDown && startSelection !== null) {
      const childRect = e.currentTarget.getBoundingClientRect();
      const childOffsetX = e.clientX - childRect.left;
      const characterOffsets = getCharacterOffsets(child.text);
      const differences = characterOffsets.map(offset => Math.abs(offset - childOffsetX));
      const selectionIndex = differences.indexOf(Math.min(...differences));

      setEndSelection(selectionIndex);
      setSelection({ atomId: child.id, range: [startSelection, selectionIndex] });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setStartSelection(null);
    setEndSelection(null);
  };

  const renderTextWithSelection = (child: AtomProps) => {
    // Check if there is a selection for the child
    if (selection.atomId !== child.id) return child.text;

    const [start, end] = selection.range || [0, 0];

    // If start and end are equal, render a caret
    if (start === end) {
      return (
        <>
          {child.text.slice(0, start)}
          <span style={{ display: 'inline-block', width: '1px', height: '16px', backgroundColor: 'black' }} />
          {child.text.slice(start)}
        </>
      );
    }

    // Render selected text with highlighting
    const textParts = [
      child.text.slice(0, start),
      <span key="selected" style={{ backgroundColor: 'yellow' }}>
        {child.text.slice(start, end)}
      </span>,
      child.text.slice(end)
    ];

    return textParts;
  };

  const childrenContainerListeners: Listeners = {
    onKeyDown: (e) => {
      if (e.key === "ArrowLeft") {
        if (selection.atomId !== undefined) {
        }
      }
      if (e.key === "ArrowRight") {

      }
    },
  }


  // console.log(selection)

  return (
    <div className="editor flex items-center"
      onMouseUp={handleMouseUp}
      style={{ width: 300, height: 100, backgroundColor: 'gray' }}>
      <div className="children-container outline-none"
        ref={ref}
        tabIndex={0}

        {...childrenContainerListeners}
      >
        {children.map((child) => (
          <span
            key={child.id}
            onMouseDown={(e) => handleMouseDown(e, child)}
            onMouseMove={(e) => handleMouseMove(e, child)}
            style={{ userSelect: 'none', cursor: 'text' }} // Prevent text selection
          >
            {(selection.atomId === child.id ? renderTextWithSelection(child) : child.text)}
            <>
              {" "}
            </>
          </span>
        ))}
      </div>
    </div>
  );
}
