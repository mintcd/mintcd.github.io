'use client'

import { useState, useEffect, useRef } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { GoSearch } from 'react-icons/go';
import Fuse from 'fuse.js';
import Latex from '@components/latex';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Terminology({ data, field }: { data: Term[], field?: Field | 'all-fields' }) {
  const fields = [
    { value: "all-fields", label: "All Fields" },
    { value: "measure-theory", label: "Measure Theory" },
    { value: "real-analysis", label: "Real Analysis" },
    { value: "probability-theory", label: "Probability Theory" },
  ];

  const dropdownRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() => {
    const state: { [key: string]: boolean } = {};
    for (let i = 65; i <= 90; i++) { // ASCII codes for A-Z
      state[String.fromCharCode(i)] = true;
    }
    return state;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedField, setSelectedField] = useState<Field | 'all-fields'>(field ? field : 'all-fields');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTerms, setFilteredTerms] = useState<Term[]>(data);

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
    let newExpandedSections = { ...expandedSections, [letter]: !expandedSections[letter] };
    console.log(newExpandedSections);
    setExpandedSections(newExpandedSections);
  }


  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchQuery(query);
    if (query === '') {
      filterOnTopic()
    } else {
      filterOnQuery(query);
    }

  }

  function filterOnQuery(query: string) {
    let filtered = filteredTerms.filter(term => {
      if (query.trim()) {
        const fuse = new Fuse([term], {
          keys: ['name'],
          includeScore: true,
          threshold: 0.5,
        });
        const results = fuse.search(query);
        return results.length > 0;
      }
      return true;
    });
    setFilteredTerms(filtered)
  }

  function filterOnTopic() {
    if (selectedField === 'all-fields') {
      setFilteredTerms(data);
    } else {
      setFilteredTerms(data.filter(term => term.fields.includes(selectedField)));
    }
  }

  useEffect(() => {
    filterOnTopic()
  }, [selectedField, data]);

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Terminology</h2>
      </div>
      <div className='grid grid-cols-5'>
        <div ref={dropdownRef} id='select' className='col-span-2 mb-4 w-48'>
          <div
            className="bg-white border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer col-span-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-gray-700">
              {fields.find(f => f.value === selectedField)?.label}
            </span>
            <ArrowDropDownIcon className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute w-48 bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
              {fields.map((field) => (
                <div
                  key={field.value}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedField(field.value as Field | "all-fields");
                    setIsOpen(false);
                  }}
                >
                  {field.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative mx-auto">
          <GoSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-700 mb-4">
        {filteredTerms.length} terms
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map(columnIndex => (
          <div key={`column-${columnIndex}`} className="space-y-4">
            {sortedKeys.slice(columnIndex * termsPerColumn, (columnIndex + 1) * termsPerColumn).map(letter => (
              <div key={letter} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div
                  className="cursor-pointer flex items-center justify-between px-4 py-3 bg-gray-100"
                  onClick={() => {
                    console.log("Clicked", letter)
                    toggleSection(letter)
                  }}
                >
                  <span className='font-bold text-xl text-gray-700'>{letter}</span>
                  {expandedSections[letter] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                </div>
                {expandedSections[letter] && (
                  <ul className="divide-y divide-gray-200">
                    {groupedTerms[letter].map((term, index) => (
                      <li key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
                        <div className="text-gray-800">
                          <Latex>{term.name}</Latex>
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
    </div>
  );
}