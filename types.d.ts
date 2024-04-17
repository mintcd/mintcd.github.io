declare module 'd3'
declare module 'katex'

type Chapter = {
    chapterName: string,
    subtitle?: string,
    notations: Notation[],
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
    name: string
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

type GraphNode = {
    nodeId: number,
    label: string = "",
    content: string = "",
    color: string = "blue",
    opacity: string = "200",
    type: string = "text"
};

type Term = {
    name: string,
    definition: string = "",
    categories: string[] = [],
    subcategories?: string[] = [],
    dependants?: string[] = []
}

type Notation = {
    name: string,
    content: string
}

type StatementType = 'axiom' | 'theorem' | 'definition' | 'corollary' | 'lemma' | 'note' | 'thoughtBubble' | 'example';
