import Latex from "react-latex-next"

export default function TheoremBox({ statement }: { statement: Statement }) {
  function bgColor(type: string) {
    if (type === 'theorem') return 'bg-blue-100'
    else if (type === 'definition') return 'bg-green-100'
    else return 'bg-gray-100'
  };

  return (
    <div className={`border rounded p-4 ${bgColor(statement.type)} m-3`}>
      <span className="text-lg font-semibold mb-2"> {statement.type.charAt(0).toUpperCase() + statement.type.slice(1)} </span>
      <Latex>
        {statement.content}
      </Latex>
    </div>
  )
}