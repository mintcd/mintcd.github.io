export default function Bold({ style, ...listeners }: { style?: React.CSSProperties } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      style={style}
      {...listeners}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bold">
      <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
    </svg>
  );
}
