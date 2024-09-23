import { CSSProperties, ReactElement, useState, useEffect, useRef } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function Autocomplete({
  suggestions,
  autoFocus = false,
  style,
  placeholder,
  value,
  freeSolo,
  icon = true,
  maxDisplay,
  onSubmit
}: {
  suggestions: string[],
  placeholder?: string,
  value?: string
  autoFocus?: boolean
  freeSolo?: boolean,
  icon?: boolean,
  maxDisplay?: number,
  style?: CSSProperties,
  onSubmit: (selectedValue: string) => void
}): ReactElement {
  const [inputValue, setInputValue] = useState(value || '');
  const [submittedValue, setSubmittedValue] = useState(value || '')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Reference to each suggestion item

  const ref = useClickAway(() => {
    setFocused(false);
  }) as any;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(freeSolo ? [] : suggestions);
    }
    setActiveSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSuggestions.length === 0) return;

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
      if (activeSuggestionIndex >= 0) {
        const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
        setInputValue(selectedSuggestion);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(-1);
        if (onSubmit) onSubmit(selectedSuggestion); // Call onSubmit with the selected value
      } else if (freeSolo && inputValue) {
        if (onSubmit) onSubmit(inputValue); // Submit even if it's a free text input
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSubmittedValue(suggestion);
    setFilteredSuggestions([]);
    if (onSubmit) onSubmit(suggestion);
  };

  useEffect(() => {
    setInputValue(value || '');
    setSubmittedValue(value || '');
  }, [value])

  return (
    <div className="relative" style={style} ref={ref}>
      <div className={`flex border border-${style?.border ? style.border : focused && 'blue-400'} relative z-[1]`}>
        <input
          type="text"
          autoFocus={autoFocus}
          className={`${!freeSolo && 'caret-transparent'} w-full focus:outline-none bg-inherit`}
          onFocus={() => {
            if (!freeSolo) setFilteredSuggestions(suggestions);
            setFocused(true);
          }}
          value={freeSolo ? inputValue : submittedValue}
          onChange={freeSolo ? handleInputChange : undefined}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={!freeSolo}
        />
        {icon && <KeyboardArrowDownRoundedIcon
          className={`transform transition-transform duration-300 ${focused ? 'rotate-180' : 'rotate-0'}`}
        />}
      </div>

      {focused && (
        <ul
          className={`absolute z-[1000] bg-white border rounded mt-1 w-full max-h-[${maxDisplay ? maxDisplay : 10}rem] overflow-y-auto`}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={el => { suggestionRefs.current[index] = el }} // Set ref to each suggestion
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 cursor-pointer ${index === activeSuggestionIndex ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};
