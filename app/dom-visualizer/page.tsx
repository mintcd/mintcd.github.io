'use client'

import React, { useState } from 'react';
import '@styles/dom.css';

function DomNode({ node }: { node: Element }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div
        className="element bg-blue-300 p-3 rounded-md"
        onClick={toggleExpand}
        style={{ cursor: node.children.length > 0 ? 'pointer' : 'default' }}
      >
        <h1 className='text-center text-black'>{node.tagName.toLowerCase()} </h1>

        {node.attributes.length > 0 && (
          <div className="attributes">
            {node.className}
            <br />
            {node.id}
            {node.children.length == 0 && <div>
              {node.textContent}
            </div>}
          </div>
        )}
      </div>

      {node.children.length > 0 && isExpanded && (
        <ul className="nested">
          {Array.from(node.children).map((childNode, index) => (
            <DomNode key={index} node={childNode as Element} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function DomVisualizer() {
  const [domTree, setDomTree] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFetchDOM = async () => {
    setError(null);
    setDomTree(null);
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch the HTML content from ${url}`);
      }
      const htmlString = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      setDomTree(doc.documentElement);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>HTML DOM Visualizer</h1>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to visualize"
          style={{ width: '80%', padding: '8px', marginRight: '8px' }}
        />
        <button onClick={handleFetchDOM} style={{ padding: '8px' }}>
          Visualize
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="dom-visualizer">
        {domTree && (
          <ul>
            <DomNode node={domTree} />
          </ul>
        )}
      </div>
    </div>
  );
};