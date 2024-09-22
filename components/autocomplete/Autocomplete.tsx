'use client';

import { CSSProperties, ReactElement, useState, useEffect } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function Autocomplete({
  suggestions,
  style,
  placeholder,
  value,
  freeSolo,
  maxDisplay = 5,
  onSubmit
}: {
  suggestions: string[],
  placeholder?: string,
  value?: string
  freeSolo?: boolean,
  maxDisplay?: number,
  style?: CSSProperties,
  onSubmit: (selectedValue: string) => void
}): ReactElement {
  const [inputValue, setInputValue] = useState(value || '');
  const [submittedValue, setSubmittedValue] = useState(value || '')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

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
      setActiveSuggestionIndex(prevIndex =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
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
      <div className={`flex ${focused && 'border border-blue-400'}`}>
        <input
          type="text"
          style={{
            caretColor: freeSolo ? 'auto' : "transparent"
          }}
          onFocus={() => {
            if (!freeSolo) setFilteredSuggestions(suggestions);
            setFocused(true);
          }}
          value={freeSolo ? inputValue : submittedValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full border-none focus:outline-none"
          placeholder={placeholder}
        />
        <KeyboardArrowDownRoundedIcon
          className={`transform transition-transform duration-300 ${focused ? 'rotate-180' : 'rotate-0'}`} // Animation added
        />
      </div>

      {focused && (
        <ul
          className="absolute z-10 bg-white border rounded mt-1 w-full overflow-y-auto" // Enable scrolling
          style={{
            maxHeight: `${maxDisplay * 2.5}rem`, // Adjust height based on maxDisplay, assuming each item is ~2.5rem tall
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
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
