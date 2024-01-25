'use client';
import React, { useState, useEffect } from 'react';

interface Chapter {
  chapter: number;
  name: string;
  // Add other properties if needed
}

interface TopicModule {
  data: string;
  link: string;
}

interface SidebarProps {
  topic: string;
  current: number;
}

export default function Sidebar({ topic, current }: SidebarProps): JSX.Element {
  const [data, setData] = useState<Chapter[]>([]);

  const topicModuleMap: { [key: string]: TopicModule } = {
    topology: {
      data: '@models/topology',
      link: 'topology',
    },
    linalg: {
      data: '@models/linalg',
      link: 'linear-algebra',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const module = await import(topicModuleMap[topic].data);
        const resultData: Chapter[] = module.default; // Assuming your module exports an array of Chapter
        setData(resultData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [topic]);

  return (
    <div>
      <div id="side-bar" className="p-4 max-h-[100vh] text-gray-800">
        <a href={`/${topicModuleMap[topic].link}/chapters/0`} className="hover:opacity-75 cursor-pointer my-10">
          <div className={`p-2 ${current === 0 ? "bg-slate-200" : ""}`}> The picture of Linear Algebra </div>
        </a>

        {data.map((chapter: Chapter) => (
          <a key={`${chapter.chapter}`} href={`//chapters/${chapter.chapter}`} className="hover:opacity-75 cursor-pointer my-10">
            <div className={`p-2 ${current === chapter.chapter ? "bg-slate-200" : ""}`}>
              Chapter {chapter.chapter} - {chapter.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
