'use client'

/**
 * TextField with suggestions, preview and bracket autocompletion
 * The elements in a text field are a textarea and a container
 */

import { ChangeEvent, CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { getAllIndices, breakLines } from "@functions/text-analysis";
import Latex from "@components/nuclears/latex";
import { getCaretCoordinates } from "@functions/elements";
export default function TextField({
  onUpdate,
  onChange,
  listeners,
  value,
  placeholder,
  updateOnEnter = true,
  style,
  focused = false,
  render,
  suggestion,
  preview,
  onKeyDown,
  onFocus
}: {
  onUpdate?: (value: string) => void;
  onChange?: (value: string) => void;
  listeners?: Listeners
  value?: string;
  placeholder?: string;
  updateOnEnter?: boolean;
  style?: CSSProperties;
  focused?: boolean;
  render?: (text: string) => ReactNode,
  suggestion?: (text: string) => ReactElement,
  preview?: (value: string, selection: [number, number]) => ReactElement,
  onKeyDown?: (keys: string[],
    setValue: (value: string) => void,
    selectedText: [number, number]) => void,
  onFocus?: () => void
}) {

  const [editing, setEditing] = useState(focused || false);
  const [editingValue, setEditingValue] = useState(value || "");

  const [lastChangedValue, setLastChangedValue] = useState("");

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
    if (e.ctrlKey) {
      const textarea = textareaRef.current;
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd;

      if (e.key === "i" || e.key === "I") {
        // Handle Ctrl + I for italics
        setEditingValue(editingValue.slice(0, start) +
          `<em>${editingValue.slice(start, end)}</em>` +
          editingValue.slice(end)
        )

      } else if (e.key === "b" || e.key === "B") {
        // Handle Ctrl + B for bold

      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLastChangedValue(editingValue);
    setEditingValue(e.target.value);
    onChange && onChange(editingValue);
  }

  useEffect(() => {
    setEditingValue(value || "");
    setEditing(focused)
  }, [value, focused]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const caretCoordinates = getCaretCoordinates(textarea)
      setPreviewPosition({ left: caretCoordinates.left, top: caretCoordinates.top + caretCoordinates.height + 5 });
    }
  }, [latexOpen])


  // Update height based on editingValue
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const height = typeof style?.height === 'number' ? style.height : Infinity;
      textarea.style.height = `${Math.min(height, breakLines(editingValue, textarea.scrollWidth).length * 21)}px`;
    }

  });

  // Whenever editing changes, update the caret position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.setSelectionRange(editingValue.length, editingValue.length);

      const caretCoordinates = getCaretCoordinates(textarea);
      textarea.scrollTop = caretCoordinates.top - textarea.clientHeight / 2;
      textarea.scrollLeft = caretCoordinates.left - textarea.clientWidth / 2;

      // Alternative: Ensure the entire textarea is scrolled into view
      textarea.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

  }, [editing])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && caretPosition !== null) {
      // Restore the caret position after setting the new value
      textarea.setSelectionRange(caretPosition, caretPosition);
      setCaretPosition(null); // Reset caret position after setting it
    }
  }, [caretPosition]);

  // Preview processing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
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
  }, [editingValue, latexOpen, latexValue]);

  return (
    <div className={`text-field min-h-[21px] min-w-[100px] rounded-sm`} {...listeners}
      onClick={(e) => {
        setEditing(true)
        listeners?.onClick?.(e)
      }}
      style={{
        width: style?.width,
        height: style?.height,
        border: style?.border,
        padding: style?.padding
      }}>
      {editing ?
        <textarea
          aria-label="text-field-input"
          ref={textareaRef}
          style={{
            padding: 0,
            width: '100%',
          }}
          className="focus:outline-none border-none resize-none bg-inherit textarea-no-scrollbar"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          // onBlur={() => {
          //   onUpdate && onUpdate(value || '')
          //   setEditing(false)
          // }}
          autoFocus
          value={editingValue}
          onFocus={onFocus}
        />
        :
        <div className="h-full overflow-ellipsis">
          {render ? render(editingValue) : editingValue}
        </div>
      }

      {latexOpen !== 'none' && editing && (
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
