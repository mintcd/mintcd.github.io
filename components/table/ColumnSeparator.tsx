export default function ColumnSeparator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="text-sm"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 12 24"
      data-testid="SeparatorIcon"
      width="12"
      height="24"
      {...props}
    >
      <rect width="0.5" height="24" x="5.75" rx="0.25" />
    </svg>
  )
}
