// declare module 'katex'
declare module 'dagre'

type Chapter = {
    name: string,
    content?: string,
    description?: string,
    sections?: Section[],
    notations?: string[],
    statements: Vertex[]
}

type Section = {
    name: string,
    content?: string,
    statements: Vertex[]
}

type Graph = {
    vertices: Vertex[],
    edges: Edge[]
}

type Vertex = {
    // Basic Properties
    key?: string,
    name: string,
    abbreviation?: string,
    type: string,
    implications?: Vertex[],

    // Graph properties
    parents?: { key: string, relation?: RelationType }[],
    depth?: number,
    short?: string,
    implication?: Vertex[],

    // Knowledge properties
    proof?: string,
    otherNames?: string[],
    href?: string,
    notation?: string[],
    content?: string,

    // Taxonomy properties
    fields?: string[],
    chapter?: string,

    // Style properties
    color?: string,
    lines?: string[],
    fx?: number,
    fy?: number,
    x?: number,
    y?: number,
    height?: number,
    width?: number
}

type Edge = {
    source: string,
    target: string,
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
type Type = 'metric' | 'architecture' | 'dataset' | 'problem' | 'mechanism' | StatementType
type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

type RelationType =
    'composited-in'
    | 'included-in'
    | 'derives'
    | 'specializes'
