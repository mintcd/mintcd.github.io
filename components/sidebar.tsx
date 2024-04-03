'use client';
import { useState, useEffect } from 'react';


export default function Sidebar({ topic, current }: { topic: string, current: number }): JSX.Element {
  const [data, setData] = useState<Chapter[]>([]);

  const topicModuleMap: { [key: string]: { link: string, name: string } } = {
    'topology': {
      link: 'topology',
      name: 'Topology',
    },
    'linear-algebra': {
      link: 'linear-algebra',
      name: 'Linear Algebra',
    },
    'real-analysis': {
      link: 'real-analysis',
      name: 'Real Analysis'
    }
  };

  const loadData = async () => {
    try {
      const data = await import(`@models/${topic}`);
      return data.default || []; // Return an empty array if topologyData.default is falsy
    } catch (error) {
      console.error('Error loading file:', error);
      return []; // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadData();
      setData(data);
    };

    fetchData();
  });

  return (
    <div>
      <div id="side-bar" className="p-4 max-h-[100vh] text-gray-800">
        <a href={`/study-notes/mathematics/${topicModuleMap[topic].link}`} className="hover:opacity-75 cursor-pointer my-10">
          <div className={`p-2 ${current === 0 ? 'bg-slate-200' : ''}`}> Summary of {topicModuleMap[topic].name} </div>
        </a>

        {data.map((chapter, index) => (
          <a key={`${index}`} href={`/${topicModuleMap[topic].link}/chapters/${index}`} className="hover:opacity-75 cursor-pointer my-10">
            <div className={`p-2 ${current === index ? 'bg-slate-200' : ''}`}>
              Chapter {index} - {chapter.chapterName}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
