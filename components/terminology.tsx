'use client'

import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { GoSearch } from 'react-icons/go';
import Fuse from 'fuse.js';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import terms from '@models/mathematics/mathematics-terminology';

export default function Terminology({ category }: { category: Category }) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredTerms, setFilteredTerms] = useState<Term[]>(category === 'all'
    ? terms
    : terms.filter(term => term.categories.includes(category)));

  const groupedTerms: { [key: string]: Term[] } = {};
  filteredTerms.forEach((term: Term) => {
    const firstLetter = term.name[0].toUpperCase();
    if (!groupedTerms[firstLetter]) {
      groupedTerms[firstLetter] = [];
    }
    groupedTerms[firstLetter].push(term);
  });

  const sortedKeys = Object.keys(groupedTerms).sort();
  const termsPerColumn = Math.ceil(sortedKeys.length / 3);

  function toggleSection(letter: string) {
    setExpandedSections(prevState => ({
      ...prevState,
      [letter]: !prevState[letter]
    }));
  }

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      filterTerms(query, selectedCategory);
      return;
    }

    filterTerms(query, selectedCategory);
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const category = event.target.value;
    setSelectedCategory(category === 'all' ? null : category);
    filterTerms(searchQuery, category === 'all' ? null : category);
  }

  function filterTerms(query: string, category: string | null) {
    let filtered = terms.filter(term => {
      if (category && !term.categories.includes(category)) return false;
      if (query.trim()) {
        const fuse = new Fuse([term], {
          keys: ['name'],
          includeScore: true,
          threshold: 0.3,
        });
        const results = fuse.search(query);
        return results.length > 0;
      }
      return true;
    });

    setFilteredTerms(filtered);
  }

  return (
    <div className='m-5'>
      <div className="my-1 text-center mb-8 flex justify-center items-center">
        <h2 className="text-2xl font-bold cursor-pointer mr-2">
          Terminology
        </h2>

        <div className="cursor-pointer">
          <GoSearch size={20} onClick={() => setSearchQuery('')} />
        </div>
      </div>
      <div className="text-lg font-bold cursor-pointer mr-2">
        {filteredTerms.length} terms added
      </div>
      <div key="search-box" className="flex justify-center my-3">
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
          {Object.keys(groupedTerms).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
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
                          {term.name}
                        </div>
                        {term.definition !== "" && <div className="bg-green-200 p-3 rounded-xl">
                          <Latex>
                            {term.definition}
                          </Latex>
                        </div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
