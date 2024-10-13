import { CSSProperties, ReactElement, useState, useEffect, useRef, ReactNode } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import zIndices from '@styles/z-indices';
import TextField from '@components/atoms/TextField';

export default function Autocomplete({
  suggestions,
  autoFocus = false,
  style,
  placeholder,
  value,
  freeSolo,
  icon = false,
  render,
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
  render?: (suggestion: string) => ReactNode
}): ReactElement {
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Reference to each suggestion item

  const ref = useClickAway(() => {
    setFocused(false);
  }) as any;

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
    <div className="autocomplete relative" style={style} ref={ref}>
      <TextField
        style={{ width: '100%' }}
        value={inputValue}
        focused={focused}
        onFocus={() => setFocused(true)}
        onChange={(value) => {
          setFilteredSuggestions(
            suggestions.filter(suggestion => suggestion.includes(value))
          );
        }}
        onUpdate={(value) => {
          onSubmit(value)
          setFocused(false)
        }}
        render={render}
      />

      {focused && (
        <ul
          className="absolute bg-white rounded mt-1 min-w-[150px] overflow-y-auto shadow-sm"
          style={{
            maxHeight: maxDisplay ? `${maxDisplay * 2.5}rem` : 'auto',
            zIndex: zIndices.autoComplete
          }}
          onKeyDown={handleKeyDown}
        >

          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={el => { suggestionRefs.current[index] = el }} // Set ref to each suggestion
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 cursor-pointer ${index === activeSuggestionIndex ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            >
              {render ? render(suggestion) : suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};
