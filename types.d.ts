declare module 'd3'
declare module 'katex'

type Chapter = {
    name: string,
    content: string = "",
    description?: string,
    sections: Section[]
    notations?: string[]
    statements?: Term[] = []
}

type Section = {
    name: string,
    content: string = ""
}


type Graph = Term[]

type Term = {
    // Basic Properties
    key?: string,
    name: string,
    abbreviation?: string,
    type?: StatementType,

    // Graph properties
    children?: string[],
    parents?: string[] = [],
    depth?: number
    short?: string,
    proof?: string,
    implication?: Term[]

    // Knowledge properties
    otherNames?: string[],
    href?: string
    notation?: string[],
    content?: string = ""

    // Taxonomy properties
    field?: string,
    chapter?: string

    // Style properties
    color?: string,
    lines?: string[]
    fx?: number,
    fy?: number,
    x?: number,
    y?: number,
    height?: number,
    width?: number,
}

type Relation = {
    source: string
    target: string
    type?: RelationType
}

type VertexCoordinate = {
    x: number
    y: number
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
type TermType = 'metric' | 'architecture' | "dataset" | 'problem' | 'mechanism' | StatementType
type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

type RelationType =     // A -[RelationType]-> B
    'composited-in'
    | 'included-in'
    | 'derives'
    | 'specializes'