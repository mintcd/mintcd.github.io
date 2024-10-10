'use client'

/**
 * TextField with suggestions, preview and bracket autocompletion
 */

import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { getAllIndices } from "@functions/text-analysis";
import Latex from "@components/latex";
import { getCaretCoordinates } from "@functions/elements";

export default function TextField({
  type,
  onUpdate,
  value,
  updateOnEnter = true,
  style,
  focused,
  render,
  suggestion,
  preview,
  onKeyDown
}: {
  type: "text" | "latex";
  onUpdate?: (value: string) => void;
  value?: string;
  updateOnEnter?: boolean;
  style?: {
    width?: number | Percentage,
    height?: number | Percentage,
    border?: string
  },
  focused?: boolean;
  render?: (text: string) => ReactElement,
  suggestion?: (text: string) => ReactElement,
  preview?: (value: string, selection: [number, number]) => ReactElement,
  onKeyDown?: (keys: string[],
    setValue: (value: string) => void,
    selectedText: [number, number]) => void,
}) {

  const [editing, setEditing] = useState(focused || false);
  const [lastChangedValue, setLastChangedValue] = useState("");
  const [editingValue, setEditingValue] = useState(value || "");
  const [latexOpen, setLatexOpen] = useState<"inline" | "newline" | "none">(
    "none"
  );
  const [previewPosition, setPreviewPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [latexValue, setLatexValue] = useState("");
  const [caretPosition, setCaretPosition] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (updateOnEnter && e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) {
          const caretPosition = textarea.selectionStart;
          const newValue =
            editingValue.slice(0, caretPosition) +
            "\n" +
            editingValue.slice(caretPosition);

          setEditingValue(newValue);
          setCaretPosition(caretPosition + 1); // Save the new caret position
        }
      } else {
        onUpdate && onUpdate(editingValue);
        setEditing(false);
      }
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const caretCoordinates = getCaretCoordinates(textarea)
      setPreviewPosition({ left: caretCoordinates.left, top: caretCoordinates.top + caretCoordinates.height + 5 });
    }
  }, [latexOpen])

  // Whenever editing changes, update the caret position
  useEffect(() => {
    textareaRef.current?.setSelectionRange(editingValue.length, editingValue.length);
  }, [editing])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && caretPosition !== null) {
      // Restore the caret position after setting the new value
      textarea.setSelectionRange(caretPosition, caretPosition);
      setCaretPosition(null); // Reset caret position after setting it
    }
  }, [caretPosition]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLastChangedValue(editingValue);
    setEditingValue(e.target.value);
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset the height to auto to calculate based on new content
      textarea.style.height = "auto";

      // Calculate the height based on scrollHeight and adjust for line height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  });

  // Preview processing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (type === 'latex') {
        const dollarIndices = getAllIndices(editingValue, '$')

        if (dollarIndices.length % 2 === 1 && editingValue.slice(editingValue.length - 1) === '$') {
          if (latexOpen === 'none') {
            setLatexOpen('inline')
            setEditingValue(prev => prev + "$")
          }
        }

        if (editingValue.slice(editingValue.length - 1) !== '$') {
          setLatexOpen('none')
          setLatexValue('')
        }

        if (latexOpen === 'inline') {
          if (latexValue === '') textarea.setSelectionRange(textarea.value.length - 1, textarea.value.length - 1);
          setLatexValue(editingValue.substring(dollarIndices.at(dollarIndices.length - 2) as number,
            dollarIndices.at(dollarIndices.length - 1) as number + 1))
        }
      }
    }
  }, [editingValue, latexOpen, latexValue, type]);

  return (
    <div className={`text-field min-h-[1.5rem] rounded-sm`}
      onClick={() => setEditing(true)}
      // onBlur={() => {
      //   onUpdate && onUpdate(value || '')
      //   setEditing(false)
      // }}
      style={{
        width: style?.width ? style?.width : 'auto',
        height: style?.height ? style?.height : 'auto',
        border: style?.border ? `1px solid ${style?.border}` : 'none'
      }}>
      {editing ?
        <textarea
          aria-label="text-field-input"
          placeholder=""
          ref={textareaRef}
          style={{
            height: '100%',
            width: '100%'
          }}
          className="p-0 focus:outline-none border-none resize-none bg-inherit"
          value={editingValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        /> :
        <div>
          {editingValue}
        </div>
      }

      {latexOpen !== 'none' && (
        <div className="preview"
          style={{
            position: 'fixed',
            top: previewPosition?.top,
            left: previewPosition?.left,
            padding: 1,
            backgroundColor: 'whitesmoke'
          }}>
          <Latex>
            {String(latexValue === '$$' || latexValue === '$' ? '' : latexValue)}
          </Latex>
        </div>

      )}
    </div>
  );
}
