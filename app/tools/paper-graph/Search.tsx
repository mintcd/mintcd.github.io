'use client';

import { useRef, useState } from 'react';
import {
  searchFromSemanticScholar,
  fetchFromSemanticScholar,
  addToNotionDatabase,
  updateNotionPage,
} from './utils';
import { SearchIcon } from '@public/icons';
import { Loading } from '@components/atoms';
import useClickOutside from '@hooks/useClickOutside';

type Suggestion = {
  id: string;
  title: string;
  abstract: string;
  year: string;
};

export default function Search({
  knownPapers,
  onSelect,
}: {
  knownPapers: Paper[];
  onSelect: (paper: any) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setModalOpen(false));

  const knownIds = new Set(knownPapers.map(p => p.id))

  async function handleSearch() {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setSearched(true);
    setLoading(true);
    const data = await searchFromSemanticScholar(query);
    setSuggestions(data);
    setLoading(false);
  }

  async function handleSelect(id: string) {
    if (knownIds.has(id)) return;

    setQuery('');
    setSuggestions([]);
    setStatus('Fetching paper...');
    const paper = await fetchFromSemanticScholar(id);

    setStatus('Adding paper to database...');
    const returnedPaper = await addToNotionDatabase(paper) as Paper
    if (!returnedPaper) {
      setStatus('Failed to add paper to database.');
      return;
    }

    returnedPaper.authors = paper.authors
    returnedPaper.references = []
    returnedPaper.citations = []


    setStatus('Adjusting links...')
    const referencesScidSet = new Set(paper.references?.map(ref => ref.scid))
    const citationsScidSet = new Set(paper.citations?.map(ref => ref.scid))
    for (const notionPaper of knownPapers) {
      if (referencesScidSet.has(notionPaper.scid)
        || notionPaper.citationScids.includes(paper.scid)) {
        await updateNotionPage(notionPaper.id, {
          citations: [...notionPaper.references ?? [], { id: returnedPaper.id }],
        })
        returnedPaper.references?.push({ id: notionPaper.id } as any)
      }
      if (citationsScidSet.has(notionPaper.scid)
        || notionPaper.referenceScids.includes(paper.scid)) {
        await updateNotionPage(notionPaper.id, {
          references: [...notionPaper.citations ?? [], { id: returnedPaper.id }],
        })
        returnedPaper.citations?.push({ id: notionPaper.id } as any)
      }
    }

    onSelect(returnedPaper);
    knownIds.add(paper.id);
    knownPapers.push(returnedPaper);

    setStatus('');
    setModalOpen(false);
  }

  return (
    <>
      <div className='search flex items-center justify-between'>
        <button
          onClick={() => setModalOpen(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <SearchIcon className="w-5 h-5 text-gray-700" />
        </button>
        <span>
          {status}
        </span>
      </div>


      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div ref={ref} className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-1">Search Paper</h2>
            <p className="text-sm text-gray-500 mb-3">{status}</p>

            <input
              type="search"
              value={query}
              placeholder="Type paper title and press Enter..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border p-2 w-full rounded mb-2"
              autoFocus
            />

            {loading
              ? <Loading />
              : suggestions.length === 0 && query.trim() !== '' ? (
                searched && <p className="text-sm text-gray-500 mt-2">No results</p>
              ) : (
                <ul className="border max-h-60 overflow-auto rounded bg-white">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      className={`p-2 ${knownIds.has(s.id)
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'hover:bg-blue-100 cursor-pointer'
                        }`}
                      onClick={() => !knownIds.has(s.id) && handleSelect(s.id)}
                    >
                      {s.title}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>
      )}
    </>
  );
}
