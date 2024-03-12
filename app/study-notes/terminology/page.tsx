'use client'
import { useState } from 'react';
import terms from '@models/terminology';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import Fuse from 'fuse.js';

export default function Terminology() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTerms, setFilteredTerms] = useState<Term[]>(terms);

  const toggleSection = (letter: string) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [letter]: !prevState[letter]
    }));
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredTerms(terms);
      return;
    }

    const fuse = new Fuse(terms, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3,
    });

    const results = fuse.search(query);
    const matchedTerms = results.map(result => result.item);
    setFilteredTerms(matchedTerms);
  };

  const groupTermsByLetter = () => {
    const groupedTerms: { [key: string]: Term[] } = {};
    filteredTerms.forEach((term: Term) => {
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
    const termsCount = sortedKeys.length;
    const termsPerColumn = Math.ceil(termsCount / 3);

    return (
      <div className="grid grid-cols-3">
        {[0, 1, 2].map(columnIndex => (
          <div key={columnIndex}>
            {sortedKeys.slice(columnIndex * termsPerColumn, (columnIndex + 1) * termsPerColumn).map(letter => (
              <div key={letter}>
                <div className="cursor-pointer flex items-center" onClick={() => toggleSection(letter)}>
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
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderSearchBox = () => {
    return (
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
    );
  };

  return (
    <div className='m-5'>
      <div className="my-1 text-center mb-8 flex justify-center items-center">
        <h2 className="text-2xl font-bold cursor-pointer mr-2">Terminology</h2>
        <div className="cursor-pointer">
          <GoSearch size={20} onClick={() => setSearchQuery('')} />
        </div>
      </div>
      {renderSearchBox()}
      {renderGroupedTerms()}
    </div>
  );
}
