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
    statementName?: string,
    content: string,
    short?: string,
    proof?: string,
    dependants?: string[],
    implications?: Statement[]
}


type Graph = Term[]

type Term = {
    // Basic Properties
    name: string,
    abbreviation?: string,
    type: TermType,
    niches: string[],

    // Graph properties
    children?: string[],
    depth?: number

    // Knowledge properties
    definition?: string,
    otherNames?: string[],
    href?: string
    notation?: string[]

    // Taxonomy properties
    subjects?: SubjectType[],
    categories?: string[],

    // Style properties
    color?: string,
    fx?: number,
    fy?: number,
    x?: number,
    y?: number
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

type EdgeCoordinate = {
    source: {
        x: number
        y: number
    },
    target: {
        x: number
        y: number
    }
}

type StatementType =
    'axiom'
    | 'corollary'
    | 'definition'
    | 'example'
    | 'lemma'
    | 'note'
    | 'proposition'
    | 'thought-bubble'
    | 'theorem'

type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes'
type TermType = 'metric' | 'architecture' | "dataset" | 'problem' | 'mechanism'
type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

type RelationType =     // A -[RelationType]-> B
    'composited-in'
    | 'included-in'
    | 'derives'
    | 'specializes'