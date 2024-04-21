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


type Graph = {
    vertices: Vertex[]
    edges: Edge[]
}

type Vertex = {
    name: string,
    color: string,
    fx: number,
    fy: number,
    x: number,
    y: number
}

type Edge = {
    source: string
    target: string
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

type Term = {
    name: string,
    definition: string,
    categories: string[],
    subcategories?: string[],
    dependants?: string[]
    type: NotationType,
    notation?: string
}

type StatementType = 'axiom' | 'theorem' | 'definition' | 'corollary' | 'lemma' | 'note' | 'thoughtBubble' | 'example' | 'proposition';
type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes';
type TermType = 'metric' | 'architecture' | "dataset" | 'problem'