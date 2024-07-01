export type Chapter = {
    name: string,
    content?: string,
    description?: string,
    sections?: Section[],
    notations?: string[],
    statements: Statement[]
}

export type Statement =
    {
        name: string,
        type: string,
        parents?: string[],
        content?: string,
        proof?: string,
        implications?: Statement[]
    }


export type Section = {
    name: string,
    content?: string,
    statements: Vertex[]
}

export type Graph = {
    metadata: {
        edgesIncluded: boolean,
        depthComputed: boolean,
        positionInitialized: boolean
    }
    vertices: Vertex[],
    edges: Edge[]
}

export type Term = {
    name: string,
    definition: string,
    fields: Field[],
    parent?: string
}

export type Vertex = {
    // Basic Properties
    key: string,
    name: string,
    abbreviation?: string,
    type: StatementType


    // Graph properties
    parents: { key: string, relation?: RelationType }[],
    depth?: number,

    // Knowledge properties
    notation?: string[],
    short?: string,
    content?: string,
    examples?: string[]
    proof?: string,
    otherNames?: string[],
    href?: string,
    implications?: {
        type: StatementType
        content: string,
        proof?: string,
    }[]

    // Taxonomy properties
    fields: Field[],
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

export type Edge = {
    source: string,
    target: string,
    relation?: RelationType
}

export type EdgeCoordinate = {
    source: VertexCoordinate,
    target: VertexCoordinate
}

export type VertexCoordinate = {
    x: number,
    y: number,
    fx: number,
    fy: number
}

export type Field = 'real-analysis' | 'measure-theory' | 'probability-theory' | 'linear-algebra'

export type StatementType =
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

export type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes'
export type Type = 'metric' | 'architecture' | 'dataset' | 'problem' | 'mechanism' | StatementType
export type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

export type RelationType =
    'composited-in'
    | 'included-in'
    | 'derives'
    | 'specializes'
