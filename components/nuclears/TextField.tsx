'use client'

/**
 * TextField with suggestions, preview and bracket autocompletion
 * The elements in a text field are a textarea and a container
 */

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getAllIndices, breakLines } from "@functions/text-analysis";
import { getCaretCoordinates } from "@functions/elements";
import { useOnClickOutside } from "@node_modules/usehooks-ts";
export default function TextField(
  {
    className = "",
    style = {},

    mode = "view",
    value = "",

    onSubmit,
    onChange,

    render
  }: {
    className?: string,
    style?: React.CSSProperties,
    mode?: "view" | "edit",
    value?: string,
    onSubmit: (value: string) => void,
    onChange?: (value: string) => void
    render?: (value: string) => JSX.Element
  }

) {

  const [_mode, setMode] = useState<"view" | "edit">(mode)
  const [_value, setValue] = useState<string>(value)
  const [lastValue, setLastValue] = useState<string>("")
  const [selection, setSelection] = useState<[number, number]>([0, 0])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useOnClickOutside(textareaRef, () => onSubmit(_value))

  const [caretPosition, setCaretPosition] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) {
          const caretPosition = textarea.selectionStart;
          const newValue =
            _value.slice(0, caretPosition) +
            "\n" +
            _value.slice(caretPosition);

          setValue(newValue)

          setCaretPosition(caretPosition + 1);
        }
      } else {
        onSubmit(_value)

        setMode("view")
      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setLastValue(_value);
    setValue(newValue);
  }


  // Update height based on value
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const height = typeof style?.height === 'number' ? style.height : Infinity;
      textarea.style.height = `${Math.min(height, breakLines(_value, textarea.clientWidth).length * 21)}px`;
    }

  });

  // Whenever mode changes, update the caret position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.setSelectionRange(_value.length, _value.length);

      const caretCoordinates = getCaretCoordinates(textarea);
      textarea.scrollTop = caretCoordinates.top - textarea.clientHeight / 2;
      textarea.scrollLeft = caretCoordinates.left - textarea.clientWidth / 2;

      // Alternative: Ensure the entire textarea is scrolled into view
      textarea.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

  }, [mode])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && caretPosition !== null) {
      // Restore the caret position after setting the new value
      textarea.setSelectionRange(caretPosition, caretPosition);
      setCaretPosition(null); // Reset caret position after setting it
    }
  }, [caretPosition]);

  useEffect(() => {
    setValue(value)
  }, [value])

  useEffect(() => {
    onChange?.(_value)
  }, [_value])

  return (
    <div className={`text-field flex items-center ${className}`}
      onClick={(e) => {
        setMode("edit")
      }}
      style={{
        width: style?.width || '100%',
        height: style?.height || '100%',
        border: style?.border,
        padding: style?.padding
      }}>
      {mode === "edit" ?
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
          autoFocus
          value={value}
        />
        :
        <div className="h-full overflow-ellipsis">
          {render ? render(_value) : _value}
        </div>
      }
    </div>
  );
}
