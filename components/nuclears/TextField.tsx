'use client'

/**
 * TextField with suggestions, preview and bracket autocompletion
 * The elements in a text field are a textarea and a container
 */

import { ChangeEvent, CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { getAllIndices, breakLines } from "@functions/text-analysis";
import Latex from "@components/atoms/latex";
import { getCaretCoordinates } from "@functions/elements";
export default function TextField({
  onUpdate,
  onChange,
  mode = "viewed",
  listeners,
  value,
  placeholder,
  updateOnEnter = true,
  style,
  render,
  suggestion,
  preview,
  onKeyDown,
  onFocus,
}: {
  className?: string;
  mode?: Mode;
  onUpdate?: (value: string) => void;
  onChange?: (value: string) => void;
  listeners?: Listeners
  value?: string;
  placeholder?: string;
  updateOnEnter?: boolean;
  style?: CSSProperties;
  render?: (text: string) => ReactNode,
  suggestion?: (text: string) => ReactElement,
  preview?: (value: string, selection: [number, number]) => ReactElement,
  onKeyDown?: (keys: string[],
    setValue: (value: string) => void,
    selectedText: [number, number]) => void,
  onFocus?: () => void
}) {

  const [_mode, setMode] = useState(mode);
  const [_modeValue, setModeValue] = useState(value || "");

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
            _modeValue.slice(0, caretPosition) +
            "\n" +
            _modeValue.slice(caretPosition);

          setModeValue(newValue);
          setCaretPosition(caretPosition + 1); // Save the new caret position
        }
      } else {
        onUpdate && onUpdate(_modeValue);
        setMode("viewed");
      }
    }

    else if (e.ctrlKey) {
      const textarea = textareaRef.current;
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd;

      if (e.key === "i" || e.key === "I") {
        // Handle Ctrl + I for italics
        setModeValue(_modeValue.slice(0, start) +
          `<em>${_modeValue.slice(start, end)}</em>` +
          _modeValue.slice(end)
        )

      } else if (e.key === "b" || e.key === "B") {
        // Handle Ctrl + B for bold

      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLastChangedValue(_modeValue);
    setModeValue(e.target.value);
    onChange && onChange(_modeValue);
  }

  // useEffect(() => {
  //   setModeValue(value || "");
  //   setMode(focused)
  // }, [value, focused]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const caretCoordinates = getCaretCoordinates(textarea)
      setPreviewPosition({ left: caretCoordinates.left, top: caretCoordinates.top + caretCoordinates.height + 5 });
    }
  }, [latexOpen])


  // Update height based on _modeValue
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const height = typeof style?.height === 'number' ? style.height : Infinity;
      textarea.style.height = `${Math.min(height, breakLines(_modeValue, textarea.scrollWidth).length * 21)}px`;
    }

  });

  // Whenever _mode changes, update the caret position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.setSelectionRange(_modeValue.length, _modeValue.length);

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
      const dollarIndices = getAllIndices(_modeValue, '$')

      if (dollarIndices.length % 2 === 1 && _modeValue.slice(_modeValue.length - 1) === '$') {
        if (latexOpen === 'none') {
          setLatexOpen('inline')
          setModeValue(prev => prev + "$")
        }
      }

      if (_modeValue.slice(_modeValue.length - 1) !== '$') {
        setLatexOpen('none')
        setLatexValue('')
      }

      if (latexOpen === 'inline') {
        if (latexValue === '') textarea.setSelectionRange(textarea.value.length - 1, textarea.value.length - 1);
        setLatexValue(_modeValue.substring(dollarIndices.at(dollarIndices.length - 2) as number,
          dollarIndices.at(dollarIndices.length - 1) as number + 1))
      }
    }
  }, [_modeValue, latexOpen, latexValue]);

  return (
    <div className={`text-field rounded-sm min-h-[1rem]`} {...listeners}
      onClick={(e) => {
        setMode("editing")
        listeners?.onClick?.(e)
      }}
      style={{
        width: style?.width || '100%',
        height: style?.height,
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
          // onBlur={() => {
          //   onUpdate && onUpdate(value || '')
          //   setMode(false)
          // }}
          autoFocus
          value={_modeValue}
          onFocus={onFocus}
        />
        :
        <div className="h-full overflow-ellipsis">
          {render ? render(_modeValue) : _modeValue}
        </div>
      }

      {latexOpen !== 'none' && _mode && (
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
