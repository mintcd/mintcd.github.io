type TableProperties = {
  itemsPerPage: number
}

type TableStyle = {
  optionsColumnWidth?: number;
  cellMinWidth?: number;
}

type MenuState = "filter" | "sorts" | "column-visibility" | "download" | "settings" | "search" | undefined

type AttrProps = {
  name: string,
  type: 'text' | 'multiselect',
  display: string,
  useLatex: boolean,
  referencing: string,
  width: number,
  order: number,
  newWindow: boolean,
  hidden: boolean,
  sort: 'none' | 'asc' | 'desc',
  suggestions: string[],
  filter: {
    'contains'?: string,
    'is'?: string[],
  }
  filterEnabled: boolean
  color: {
    [tag: string]: string
  }
}
