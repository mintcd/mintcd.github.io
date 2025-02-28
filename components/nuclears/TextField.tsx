'use client'

/**
 * TextField with suggestions, preview and bracket autocompletion
 * The elements in a text field are a textarea and a container
 */

import { ChangeEvent, CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { getAllIndices, breakLines } from "@functions/text-analysis";
import { getCaretCoordinates } from "@functions/elements";
import { useOnClickOutside } from "@node_modules/usehooks-ts";
export default function TextField({
  onUpdate,
  mode = "viewed",
  listeners,
  value = "",
  placeholder,
  updateOnEnter = true,
  style,
  suggestion,
  preview,
  onKeyDown,
  onFocus,
}: {
  className?: string;
  mode?: Mode;
  onUpdate?: (value: string) => void;
  listeners?: Listeners
  value?: string;
  placeholder?: string;
  updateOnEnter?: boolean;
  style?: CSSProperties;
  suggestion?: (text: string) => ReactElement,
  preview?: (value: string, selection: [number, number]) => ReactElement,
  onKeyDown?: (e: React.KeyboardEvent, value: string) => void
  onFocus?: () => void
}) {

  const [_mode, setMode] = useState(mode);
  const [_value, setValue] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [lastChangedValue, setLastChangedValue] = useState("");

  useOnClickOutside(textareaRef, () => {
    onUpdate && onUpdate(_value)
    setMode("viewed");
  })

  const [latexOpen, setLatexOpen] = useState<"inline" | "newline" | "none">(
    "none"
  );
  const [previewPosition, setPreviewPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);


  const [latexValue, setLatexValue] = useState("");
  const [caretPosition, setCaretPosition] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    listeners?.onKeyDown?.(e);

    if (updateOnEnter && e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) {
          const caretPosition = textarea.selectionStart;
          const newValue =
            _value.slice(0, caretPosition) +
            "\n" +
            _value.slice(caretPosition);

          setValue(newValue);
          setCaretPosition(caretPosition + 1); // Save the new caret position
        }
      } else {
        console.log("Enter pressed")
        onUpdate?.(_value);
        setMode("viewed");
      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setLastChangedValue(_value);
    setValue(newValue);
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const caretCoordinates = getCaretCoordinates(textarea)
      setPreviewPosition({ left: caretCoordinates.left, top: caretCoordinates.top + caretCoordinates.height + 5 });
    }
  }, [latexOpen])


  // Update height based on _value
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const height = typeof style?.height === 'number' ? style.height : Infinity;
      textarea.style.height = `${Math.min(height, breakLines(_value, textarea.clientWidth).length * 21)}px`;
    }

  });

  // Whenever _mode changes, update the caret position
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

  }, [_mode])

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
      const dollarIndices = getAllIndices(_value, '$')

      if (dollarIndices.length % 2 === 1 && _value.slice(_value.length - 1) === '$') {
        if (latexOpen === 'none') {
          setLatexOpen('inline')
          setValue(prev => prev + "$")
        }
      }

      if (_value.slice(_value.length - 1) !== '$') {
        setLatexOpen('none')
        setLatexValue('')
      }

      if (latexOpen === 'inline') {
        if (latexValue === '') textarea.setSelectionRange(textarea.value.length - 1, textarea.value.length - 1);
        setLatexValue(_value.substring(dollarIndices.at(dollarIndices.length - 2) as number,
          dollarIndices.at(dollarIndices.length - 1) as number + 1))
      }
    }
  }, [_value, latexOpen, latexValue]);

  useEffect(() => {
    setValue(value)
  }, [value])

  return (
    <div className={`text-field flex items-center`} {...listeners}
      onClick={(e) => {
        setMode("editing")
        listeners?.onClick?.(e)
      }}
      style={{
        width: style?.width || '100%',
        height: style?.height || '100%',
        border: style?.border,
        padding: style?.padding
      }}>
      {_mode === "editing" ?
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
          value={_value}
          onFocus={onFocus}
        />
        :
        <div className="h-full overflow-ellipsis">
          {_value}
        </div>
      }
    </div>
  );
}
