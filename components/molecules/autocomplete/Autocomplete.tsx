import { CSSProperties, ReactElement, useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import zIndices from '@styles/z-indices';
import TextField from '@components/nuclears/TextField';
import Fuse from 'fuse.js';

export default function Autocomplete({
  suggestions,
  autoFocus = false,
  style,
  placeholder,
  value,
  freeSolo,
  icon = false,
  renderSuggestion,
  renderDropper,
  maxDisplay,
  onSubmit
}: {
  suggestions: string[]
  placeholder?: string,
  value?: string
  autoFocus?: boolean
  freeSolo?: boolean,
  icon?: boolean,
  maxDisplay?: number,
  style?: CSSProperties,
  onSubmit: (selectedValue: string) => void
  renderSuggestion?: (value: string) => ReactNode
  renderDropper?: (value: string) => ReactNode
}): ReactElement {
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Reference to each suggestion item

  const ref = useClickAway(() => {
    setFocused(false);
  }) as any;

  const fuse = useMemo(() => new Fuse(suggestions, {
    shouldSort: true,
    threshold: 0.5,
  }), [suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setFocused(false)
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
        prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestionIndex !== -1) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setInputValue(selectedSuggestion);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(-1);
        setFocused(false);
        onSubmit(selectedSuggestion)
      } else if (freeSolo) {
        setFocused(false);
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
    <div className="autocomplete relative" style={style} ref={ref} onKeyDown={handleKeyDown}>
      <TextField
        style={{ width: style?.width, height: style?.height }}
        value={inputValue}
        focused={focused}
        onFocus={() => setFocused(true)}
        onChange={(value) => {
          setFilteredSuggestions(
            suggestions.filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
          );
          // console.log(fuse.search(value).map(({ item }) => item))
          // setFilteredSuggestions(
          //   fuse.search(value).map(({ item }) => item)
          // );
        }}
        onUpdate={(value) => {
          onSubmit(value)
          setFocused(false)
        }}
        render={renderDropper}
      />

      {focused && (
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
