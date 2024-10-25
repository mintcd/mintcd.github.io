export type AtomProps = {
  id: number,
  text: string,
  styles?: string[],
}

export type Selection = {
  atomId: number | undefined
  range: [number, number] | undefined
}