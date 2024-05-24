declare module 'd3'
declare module 'katex'

type Chapter = {
    chapterName: string,
    description?: string,
    notations: Term[],
    statements: Statement[]
}


type Statement = {
    id?: string,
    type: StatementType,
    name?: string,
    content: string,
    short?: string,
    proof?: string,
    dependants?: string[],
    implications?: Statement[]
}


type Graph = Term[]

type Term = {
    // Basic Properties
    key: string,
    name: string,
    abbreviation?: string,
    type?: StatementType,
    relevant: string[],

    // Graph properties
    children?: string[],
    parents: string[] = [],
    depth?: number

    // Knowledge properties
    definition: string = "",
    otherNames?: string[],
    href?: string
    notation?: string[]

    // Taxonomy properties
    subjects?: SubjectType[],
    categories?: string[],
    narrowestField?: string,

    // Style properties
    color?: string,
    lines: string[]
    fx?: number,
    fy?: number,
    x: number,
    y: number,
    height: number,
    width: number,
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

type Edge = {
    source: Term
    target: Term
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