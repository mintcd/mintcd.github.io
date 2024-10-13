import { CSSProperties, ReactElement, useState, useEffect, useRef, ReactNode } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import zIndices from '@styles/z-indices';

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
        onSubmit(selectedSuggestion)
      } else if (freeSolo) {
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
      <div className={`flex ${style?.border && `border border-${style?.border}`}  relative z-[1]`}>
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
              {render ? render(suggestion) : suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};
