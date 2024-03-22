declare module 'react-latex'
declare module 'd3'


type Chapter = {
    chapter: number;
    name: string;
    statements: Statement[];
}

type Statement = {
    id?: string,
    type: 'axiom' | 'theorem' | 'definition' | 'corollary' | 'lemma' | 'note',
    name?: string,
    content: string,
    short?: string,
    proof?: string,
    dependants?: string[],
    implications?: Statement[]
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
