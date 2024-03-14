'use client'

import { useState } from 'react';
import terms from '@models/terminology';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import Fuse from 'fuse.js';

export default function Terminology() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      filterTerms(query, selectedCategory);
      return;
    }

    filterTerms(query, selectedCategory);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setSelectedCategory(category === 'all' ? null : category);
    filterTerms(searchQuery, category === 'all' ? null : category);
  };

  const filterTerms = (query: string, category: string | null) => {
    let filtered = terms;
    if (query.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        includeScore: true,
        threshold: 0.3,
      });
      const results = fuse.search(query);
      filtered = results.map(result => result.item);
    }

    if (category) {
      filtered = filtered.filter(term => term.categories.includes(category));
    }

    setFilteredTerms(filtered);
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
      <div className="flex justify-center my-3">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mr-2"
        />
        <select
          value={selectedCategory || 'all'}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {/* Assuming categories are extracted from the terms data */}
          {Object.keys(groupTermsByCategory()).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const groupTermsByCategory = () => {
    const groupedTerms: { [key: string]: Term[] } = {};
    filteredTerms.forEach((term: Term) => {
      term.categories.forEach(category => {
        if (!groupedTerms[category]) {
          groupedTerms[category] = [];
        }
        groupedTerms[category].push(term);
      });
    });
    return groupedTerms;
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
