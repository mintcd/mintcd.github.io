export type AtomProps = {
  type?: 'text' | 'latex',
  text: string,
  style?: string[],
}

export type Selection = {
  from: {
    id: number,
    offset: number
  },
  to: {
    id: number,
    offset: number
  }
}