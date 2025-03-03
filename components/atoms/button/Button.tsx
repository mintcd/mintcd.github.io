import "./button.css"

export default function Button({ text, icon, style, listeners }:
  {
    text?: string,
    icon?: React.ReactElement<SVGElement>,
    style?: React.CSSProperties,
    listeners?: Listeners
  }) {

  return (
    <button className={`flex items-center hover:cursor-pointer w-fit p-1 rounded-md`}
      style={{
        backgroundColor: style?.color
      }}
      onClick={listeners?.onClick}
    >
      <div className={`mr-2 text-white text-center`}>{text}</div>
      <div className={`flex items-center bg-[${style?.color}] p-1`}>
        {icon}
      </div>
    </button>
  )
}