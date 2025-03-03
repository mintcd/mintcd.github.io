// type Tree = {
//   nodes: TreeNode[] = [],
//   layout: TreeNodeLayout
// }

type NodeType = 'contention' | 'support' | 'objection' | 'premise'

type TreeEdge = {
  source: number,
  target: number,
  relation?: RelationType,
}

type TreeNode = {
  // Information
  id: number
  name?: string,
  type: string
  content: string[],
  href?: string,
  keywords?: Field[],

  // Graph
  children: number[] = [],
  depth: number = 0,
  order: number

  // Styles
  color?: string,
  shape?: Shape
  lines?: string[],

  screenX?: number,
  screenY?: number,

  width?: number,
  height?: number,
}

type TreeLayout = {
  [key: number]: Layout
}

type Layout = {
  x: number,
  y: number,
  width: number,
  height: number,
  subLayouts: {
    x: number,
    y: number,
    width: number,
    height: number
  }[]
}

type SubNode = {
  content: string,
  width?: number,
  height?: number,
  x?: number,
  y?: number
}

type Option = 'add' | 'edit' | 'delete'