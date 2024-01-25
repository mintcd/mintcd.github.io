'use client';
import topology from '@models/topology';
import linalg from '@models/linalg';



interface TopicModule {
  model: Chapter[],
  link: string,
  name: string
}

interface SidebarProps {
  topic: string;
  current: number;
}


export default function Sidebar({ topic, current }: SidebarProps): JSX.Element {

  const topicModuleMap: { [key: string]: TopicModule } = {
    topology: {
      model: topology,
      link: 'topology',
      name: 'Topology'
    },
    linalg: {
      model: linalg,
      link: 'linear-algebra',
      name: 'Linear Algebra'
    },
  };

  const data = topicModuleMap[topic].model

  return (
    <div>
      <div id="side-bar" className="p-4 max-h-[100vh] text-gray-800">
        <a href={`/${topicModuleMap[topic].link}/chapters/0`} className="hover:opacity-75 cursor-pointer my-10">
          <div className={`p-2 ${current === 0 ? "bg-slate-200" : ""}`}> Introduction to {topicModuleMap[topic].name} </div>
        </a>


        {data.map((chapter: Chapter) => (
          <a key={`${chapter.chapter}`} href={`/${topicModuleMap[topic].link}/chapters/${chapter.chapter}`} className="hover:opacity-75 cursor-pointer my-10">
            <div className={`p-2 ${current === chapter.chapter ? "bg-slate-200" : ""}`}>
              Chapter {chapter.chapter} - {chapter.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
