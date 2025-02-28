type ComponentStyle = {
  width?: number,
  border?: number
}

type FilterAction = {
  name: string,
  predicate?: 'contains' | 'is',
  candidate?: string
}

type JsonObject<dataType> = {
  [key: string]: dataType
}

type Point = {
  x: number,
  y: number,
  z: number,
}

type AttrsByName = { [name: string]: AttrProps }

type FilterProp = {
  name?: string,
  action?: "contains" | "is" | undefined,
  option?: string,
  applied?: boolean
}

type DataItem = {
  [key: string]: any;
};

type Chapter = {
  name: string,
  content?: string,
  description?: string,
  sections?: Section[],
  notations?: string[],
  statements: Statement[]
}

type Statement =
  {
    name: string,
    type: string,
    parents?: string[],
    content?: string,
    proof?: string,
    implications?: Statement[]
  }


type Section = {
  name: string,
  content?: string,
  statements: Vertex[]
}

type Graph = {
  vertices: Vertex[],
  edges?: Edge[]
}

type Shape = 'rect' | 'circ'

type Term = {
  name: string,
  definition: string,
  fields: Field[],
  parent?: string
}

type Vertex = {
  // Information
  key?: string,
  id: number
  name?: string,
  abbreviation?: string,
  type: string
  content: string | string[],
  href?: string,
  keywords?: Field[],

  // Graph
  parents?: string[],
  children?: number[]
  depth?: number,
  order?: number

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

type Edge = {
  source: number,
  target: number,
  relation?: RelationType
}

type EdgeCoordinate = {
  source: VertexCoordinate,
  target: VertexCoordinate
}

type VertexCoordinate = {
  x: number,
  y: number,
  fx: number,
  fy: number
}

type Field = 'real-analysis' | 'measure-theory' | 'probability-theory' | 'linear-algebra'

type StatementType =
  'axiom'
  | 'corollary'
  | 'definition'
  | 'example'
  | 'lemma'
  | 'notation'
  | 'note'
  | 'proposition'
  | 'thought-bubble'
  | 'theorem'
  | 'definition-theorem'

type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes'
type Type = 'metric' | 'architecture' | 'dataset' | 'problem' | 'mechanism' | StatementType
type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

type RelationType =
  'composited-in'
  | 'included-in'
  | 'derives'
  | 'specializes'
