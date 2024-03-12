'use client'
import { useState } from 'react';
import terms from '@models/terminology'
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function Terminology() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (letter: string) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [letter]: !prevState[letter]
    }));
  };

  const groupTermsByLetter = () => {
    const groupedTerms: { [key: string]: Term[] } = {};
    terms.forEach((term: Term) => {
      const firstLetter = term.name[0].toUpperCase();
      if (!groupedTerms[firstLetter]) {
        groupedTerms[firstLetter] = [];
      }
      groupedTerms[firstLetter].push(term);
    });
    return groupedTerms;
  };

  const renderGroupedTerms = () => {
    const groupedTerms = groupTermsByLetter();
    const sortedKeys = Object.keys(groupedTerms).sort();

    return sortedKeys.map(letter => (
      <div key={letter}>
        <div className="flex items-center cursor-pointer" onClick={() => toggleSection(letter)}>
          <span className='mr-3 w-[10px]'>{letter}</span>
          {expandedSections[letter] ? <FaChevronDown /> : <FaChevronUp />}
        </div>
        {expandedSections[letter] && (
          <ul>
            {groupedTerms[letter].map(term => (
              <li key={term.name}>
                <div>
                  {term.name} ({term.categories.join(', ')})
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  return (
    <div className='m-5'>
      {renderGroupedTerms()}
    </div>
  );
}