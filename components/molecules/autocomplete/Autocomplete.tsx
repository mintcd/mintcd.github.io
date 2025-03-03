import zIndices from '@styles/z-indices';
import TextField from '@components/atoms/text-field';
import Fuse from 'fuse.js';
import { useClickAway } from "@uidotdev/usehooks";
import { useState, useRef, useMemo, useEffect } from 'react'

export default function Autocomplete({
  className,
  focused = true,
  suggestions,
  mode = "view",
  style,
  placeholder,
  value,
  addable = true,
  renderSuggestion,
  renderDropper,
  maxDisplay,
  onSubmit
}: {
  className?: string
  suggestions: string[],
  focused?: boolean,
  mode?: "view" | "edit",
  placeholder?: string,
  value?: string
  autoFocus?: boolean
  addable?: boolean,
  maxDisplay?: number,
  style?: React.CSSProperties,
  onSubmit: (selectedValue: string) => void
  renderSuggestion?: (value: string) => React.ReactNode
  renderDropper?: (value: string) => React.ReactNode
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(addable ? -1 : 0);

  const [_mode, setMode] = useState<"view" | "edit">(mode);

  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Reference to each suggestion item
  const ref = useClickAway(() => setMode("view")) as any


  const fuse = useMemo(() => new Fuse(suggestions, {
    shouldSort: true,
    threshold: 0.2,
  }), [suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setActiveSuggestionIndex(addable ? -1 : 0)
    setMode("view")
    if (onSubmit) onSubmit(suggestion);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex > -1 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex !== -1 && filteredSuggestions.length > 0) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setInputValue(selectedSuggestion);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(addable ? -1 : 0);
        setMode("view");
        console.log(selectedSuggestion);
        onSubmit(selectedSuggestion);
      } else {
        if (addable) {
          setMode("view");
          onSubmit(inputValue);
        }
      }
    }
  };

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionRefs.current[activeSuggestionIndex]) {
      suggestionRefs.current[activeSuggestionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeSuggestionIndex]);

  return (
    <div className="autocomplete relative min-w-[100px]"
      style={style}
      onKeyDown={handleKeyDown}
      ref={ref}>
      <TextField
        style={{ width: style?.width, height: style?.height }}
        mode={mode}
        value={inputValue}

        onSubmit={(value) => {
          onSubmit(value as string)
          setMode("view")
        }}
        onChange={(value) => {
          setFilteredSuggestions([
            "",
            ...fuse.search(value as string).map(({ item }) => item)]);
        }}
      />

      {_mode == "edit" && (
        <ul
          className="absolute bg-white rounded mt-1 min-w-[150px] overflow-y-auto shadow-sm"
          style={{
            maxHeight: maxDisplay ? `${maxDisplay * 2.5}rem` : 'auto',
            zIndex: zIndices.autoComplete
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={el => { suggestionRefs.current[index] = el }}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 cursor-pointer ${index === activeSuggestionIndex ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            >
              {renderSuggestion ? renderSuggestion(suggestion) : suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};
