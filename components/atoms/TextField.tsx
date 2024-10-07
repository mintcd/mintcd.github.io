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
  render

}: {
  type: "text" | "latex";
  onUpdate: (value: string) => void;
  value?: string;
  updateOnEnter?: boolean;
  style?: {
    width?: number | 'fit',
    height?: number | 'fit',
    border?: string
  },
  render?: (value: string) => ReactElement
}) {

  const [editing, setEditing] = useState(false)

  const [lastChangedValue, setLastChangedValue] = useState("")
  const [editingValue, setEditingValue] = useState(value || "");


  const [latexOpen, setLatexOpen] = useState<'inline' | 'newline' | 'none'>('none');
  const [previewPosition, setPreviewPosition] = useState<{ top: number; left: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [latexValue, setLatexValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (updateOnEnter && e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setEditingValue(editingValue + "\n");
      } else {
        onUpdate(editingValue);
        setEditing(false)
      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setLastChangedValue(editingValue)
    setEditingValue(e.target.value)
  }


  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const caretCoordinates = getCaretCoordinates(textarea)
      setPreviewPosition({ left: caretCoordinates.left, top: caretCoordinates.top + caretCoordinates.height + 5 });
    }
  }, [latexOpen])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
      textarea.focus();
    }
  }, [value, editing])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset the height to auto to calculate based on new content
      textarea.style.height = "auto";

      // Calculate the height based on scrollHeight and adjust for line height
      const scrollHeight = textarea.scrollHeight;
      // const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 16;

      // If the difference between height and scrollHeight is less than the line height, set it directly
      textarea.style.height = `${scrollHeight}px`;
    }
  });

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
    <div className={`text-field w-full min-h-[1.5rem] rounded-sm flex items-center`}
      onClick={() => setEditing(true)}
      style={{
        width: typeof style?.width === 'number' ? style?.width : 'fit',
        height: typeof style?.height === 'number' ? style?.height : 'fit',
        border: style?.border ? `1px solid ${style?.border}` : 'none'
      }}>
      {editing ?
        <textarea
          aria-label="text-field-input"
          placeholder=""
          ref={textareaRef}
          className="w-full p-0 focus:outline-none border-none resize-none bg-inherit"
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
        <div style={{
          position: 'absolute',
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
