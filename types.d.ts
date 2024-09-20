type JsonObject<dataType> = {
    [key: string]: dataType
}

type AttrProps = {
    name: string,
    useLatex?: boolean,
    type?: string,
    referencing?: string,
    width?: number,
    order?: number,
    newWindow?: boolean,
    hidden?: boolean,
    display?: string
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
    metadata?: {
        edgesIncluded: boolean,
        depthComputed: boolean,
        positionInitialized: boolean
    }
    vertices: Vertex[],
    edges?: Edge[]
}

type Term = {
    name: string,
    definition: string,
    fields: Field[],
    parent?: string
}

type Vertex = {
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
    content?: string,
    examples?: string[]
    proof?: string,
    otherNames?: string[],
    href?: string,

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
