'use client';

import { useRef, useState } from 'react';
import {
  sleep,
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
  knownIds,
  onSelect,
}: {
  knownIds: Set<string>;
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
    setStatus('Fetching selected paper...');
    const paper = await fetchFromSemanticScholar(id);

    setStatus('Adding selected paper to database...');
    const returnedPaper = await addToNotionDatabase({ ...paper, status: 'shown' });
    if (!returnedPaper) return;

    knownIds.add(paper.paperId);

    returnedPaper.authors = paper.authors.map((a: any) => a.name);
    onSelect(returnedPaper);

    const referenceIds: string[] = [];
    const citationIds: string[] = [];

    setStatus('Adding references...');
    for (const [index, ref] of (paper.references ?? []).entries()) {
      if (ref.paperId && !knownIds.has(ref.paperId)) {
        const returnedRef = await addToNotionDatabase({ ...ref, status: 'suggested' });
        if (!returnedRef) continue;
        knownIds.add(ref.paperId);
        referenceIds.push(returnedRef.id);
        await sleep(200);
        setStatus(`Added references ${index + 1}/${paper.references.length}...`);
      }
    }

    setStatus('Adding citations...');
    for (const [index, cite] of (paper.citations ?? []).entries()) {
      if (cite.paperId && !knownIds.has(cite.paperId)) {
        const returnedCite = await addToNotionDatabase({ ...cite, status: 'suggested' });
        if (!returnedCite) continue;
        knownIds.add(cite.paperId);
        citationIds.push(returnedCite.id);
        await sleep(2000);
        setStatus(`Added citations ${index + 1}/${paper.citations.length}...`);
      }
    }

    await updateNotionPage(returnedPaper.id, {
      references: referenceIds,
      citations: citationIds,
    });

    setStatus('');
    setModalOpen(false);
  }

  return (
    <>
      <div className='search flex justify-between'>
        <button
          onClick={() => setModalOpen(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <SearchIcon className="w-5 h-5 text-gray-700" />
        </button>
        {status !== "" &&
          <span>
            {status}
          </span>}
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
