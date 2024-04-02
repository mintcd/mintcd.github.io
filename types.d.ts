declare module 'react-latex'
declare module 'd3'


type Chapter = {
    chapter: number;
    name: string;
    statements: Statement[];
}

type StatementType = 'axiom' | 'theorem' | 'definition' | 'corollary' | 'lemma' | 'note' | 'thoughtBubble' | 'example';

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

type Notation = {
    name: string,
    content: string
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
