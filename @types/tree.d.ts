type Tree = {
  nodes: TreeNode[] = [],
  edges: TreeEdge[] = [],
}

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
  children?: number[] = [],
  depth: number = 0,
  order: number

  // Styles
  color?: string,
  shape?: Shape
  lines?: string[],
  fx?: number,
  fy?: number,
  x?: number,
  y?: number,
  x1?: number,
  y1?: number,
  x2?: number,
  y2?: number,
  screenX?: number,
  screenY?: number,
  width?: number,
  height?: number,
}

type Option = 'add' | 'edit' | 'delete'