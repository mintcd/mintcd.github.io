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

  console.log(data)

  return (
    <div>
      <div id="side-bar" className="p-4 max-h-[100vh] text-gray-800">
        <a href={`/${topicModuleMap[topic].link}/chapters/0`} className="hover:opacity-75 cursor-pointer my-10">
          <div className={`p-2 ${current === 0 ? 'bg-slate-200' : ''}`}> Introduction to {topicModuleMap[topic].name} </div>
        </a>

        {data.map((chapter: Chapter) => (
          <a key={`${chapter.chapter}`} href={`/${topicModuleMap[topic].link}/chapters/${chapter.chapter}`} className="hover:opacity-75 cursor-pointer my-10">
            <div className={`p-2 ${current === chapter.chapter ? 'bg-slate-200' : ''}`}>
              Chapter {chapter.chapter} - {chapter.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
