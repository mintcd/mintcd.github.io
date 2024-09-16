export default function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <span className="w-[24px] h-[24px] hover:bg-gray-100 hover:rounded-full flex items-center justify-center">
      <svg className=""
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        data-testid="TripleDotsVerticalIcon"
        {...props}>
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
        </path>
      </svg>
    </span>
  )

}