declare module 'd3'
declare module 'katex'
declare module 'dagre'
declare module 'cytoscape'


type Chapter = {
    name: string,
    content?: string,
    description?: string,
    sections?: Section[],
    notations?: string[]
    statements: Vertex[] = []
}

type Section = {
    name: string,
    content: string = ""
}


type Graph = {
    vertices: Vertex[],
    edges: Relation[]
}

type Vertex = {
    // Basic Properties
    key?: string,
    name: string,
    abbreviation?: string,
    type: StatementType,
    implications?: Vertex[] = []

    // Graph properties
    depth?: number = 0,
    short?: string,
    proof?: string,
    implication?: Vertex[]

    // Knowledge properties
    otherNames?: string[],
    href?: string
    notation?: string[],
    content?: string = ""

    // Taxonomy properties
    field?: string | string[],
    chapter?: string

    // Style properties
    color?: string,
    lines?: string[] = []
    fx?: number,
    fy?: number,
    x?: number = 0,
    y?: number = 0,
    height?: number = 75,
    width?: number = 150,
}

type Edge = {
    source: Vertex,
    target: Vertex
    relation: RelationType
}

type EdgeCoordinate = {
    source: VertexCoordinate,
    target: VertexCoordinate
}


type VertexCoordinate = {
    x: number
    y: number
    fx: number
    fy: number
}

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

type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes'
type Type = 'metric' | 'architecture' | "dataset" | 'problem' | 'mechanism' | StatementType
type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

type RelationType =     // A -[RelationType]-> B
    'composited-in'
    | 'included-in'
    | 'derives'
    | 'specializes'