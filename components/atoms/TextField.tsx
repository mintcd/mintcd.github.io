'use client'

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getAllIndices } from "@functions/text-analysis";
import Latex from "@components/latex";
import { getCaretCoordinates } from "@functions/elements";

export default function TextField({
  type,
  onUpdate,
  initialValue,
  updateOnEnter = true

}: {
  type: "text" | "latex";
  onUpdate: (value: string) => void;
  initialValue?: string;
  updateOnEnter?: boolean;
}) {
  const [oldValue, setOldValue] = useState("")
  const [editingValue, setEditingValue] = useState(initialValue || "");
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
      }
    }
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setOldValue(editingValue)
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
  }, [initialValue])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea)
      textarea.style.height = `${textarea.scrollHeight}px`;
  }, [editingValue])

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
    <div className="text-field">
      <textarea
        placeholder=""
        ref={textareaRef}
        className="w-full p-0 focus:outline-none border-none resize-none bg-inherit"
        value={editingValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />

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
