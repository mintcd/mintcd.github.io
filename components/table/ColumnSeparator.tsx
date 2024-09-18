export default function ColumnSeparator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="transition-colors duration-300 ease-in-out"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 12 24"
      data-testid="SeparatorIcon"
      width="15"
      height="24"
      {...props}
    >
      <rect
        width="0.5"
        height="24"
        x="5.75"
        rx="0.25"
        style={{ fill: "currentColor" }}
      />
    </svg>
  );
}
