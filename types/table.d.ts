type TableProps = {
  name: string,
  style: TableStyle,
  menu: MenuState,
  itemsPerPage: number,
  currentPage: number,
  upToDate: boolean,
  searchString: string,
  attrsByName: { [key: string]: AttrProps },
}

type TableStyle = {
  optionsColumnWidth?: number;
  cellMinWidth?: number;
}

type MenuState = "filter" | "sorts" | "columnVisibility" | "download" | "settings" | "search" | undefined

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
    enabled: boolean,
    predicates: {
      contains?: string,
      is?: string[],
    }
  }
  color: {
    [tag: string]: string
  }
}
