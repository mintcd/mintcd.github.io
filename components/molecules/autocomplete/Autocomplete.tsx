import { CSSProperties, ReactElement, useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import zIndices from '@styles/z-indices';
import TextField from '@components/nuclears/TextField';
import Fuse from 'fuse.js';

export default function Autocomplete({
  className,
  suggestions,
  mode = "viewed",
  style,
  placeholder,
  value,
  addable = true, // Accept new values rather than suggestions
  icon = false,
  renderSuggestion,
  renderDropper,
  maxDisplay,
  onSubmit
}: {
  className?: string
  suggestions: string[],
  mode?: Mode,
  placeholder?: string,
  value?: string
  autoFocus?: boolean
  addable?: boolean,
  icon?: boolean,
  maxDisplay?: number,
  style?: CSSProperties,
  onSubmit: (selectedValue: string) => void
  renderSuggestion?: (value: string) => ReactNode
  renderDropper?: (value: string) => ReactNode
}): ReactElement {
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(addable ? -1 : 0);

  const [_mode, setMode] = useState<"viewed" | "editing">(mode);

  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Reference to each suggestion item


  const fuse = useMemo(() => new Fuse(suggestions, {
    shouldSort: true,
    threshold: 0.5,
  }), [suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setActiveSuggestionIndex(addable ? -1 : 0)
    setMode("viewed")
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
      e.preventDefault()
      if (activeSuggestionIndex !== -1) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setInputValue(selectedSuggestion);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(0);
        setMode("viewed");
        onSubmit(selectedSuggestion)
      } else if (addable) {
        setMode("viewed");
        onSubmit(inputValue);
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


  useEffect(() => {
    setInputValue(value || '');
  }, [value])

  return (
    <div className="autocomplete relative min-w-[100px]" style={style} onKeyDown={handleKeyDown}>
      <TextField
        style={{ width: style?.width, height: style?.height }}
        value={inputValue}
        mode={mode}
        onFocus={() => setMode("editing")}
        onChange={(value) => {
          setFilteredSuggestions(
            [
              ...suggestions.filter(suggestion => suggestion === ""),
              ...fuse.search(value).map(({ item }) => item)

            ]
          );
        }}
        onUpdate={(value) => {
          onSubmit(value)
          setMode("viewed")
        }}
        render={renderDropper}
      />

      {_mode && (
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
              ref={el => { suggestionRefs.current[index] = el }} // Set ref to each suggestion
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
