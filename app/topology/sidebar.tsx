import topology from "@models/topology"

export default function Sidebar({ current }: { current: number }) {
  return (
    <div>
      <div id="side-bar" className="p-4 max-h-[100vh] text-gray-800">
        <a href="/linear-algebra/chapters/0" className="hover:opacity-75 cursor-pointer my-10"
        >
          <div className={`p-2 ${current === 0 ? "bg-slate-200" : ""}`}> The picture of Linear algebra </div>
        </a>

        {topology.map(chapter =>
          <a key={`${chapter.chapter}`} href={`/linear-algebra/chapters/${chapter.chapter}`} className="hover:opacity-75 cursor-pointer my-10">
            <div className={`p-2 ${current === chapter.chapter ? "bg-slate-200" : ""}`}>
              Chapter {chapter.chapter} - {chapter.name}
            </div>
          </a>)}
      </div>
    </div>

  )
}