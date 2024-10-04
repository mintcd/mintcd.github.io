export type FilterProp = {
  [name: string]: {
    [predicate in 'contains' | 'is']?: string[]
  }
}

export type AttrProps = {
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
    [predicate in 'contains' | 'is']?: string[] | undefined
  }
  filterEnabled: boolean
  color: {
    [tag: string]: string
  }
}

export type FilterAction = {
  name: string,
  predicate?: 'contains' | 'is'
  candidate?: string
}

export type menuState = "filter" | "sorts" | "column-visibility" | "download" | "settings" | "search" | ""