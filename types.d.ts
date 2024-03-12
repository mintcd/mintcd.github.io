declare module 'react-latex'
declare module 'd3'


type Chapter = {
    chapter: number;
    name: string;
    statements: Statement[];
}

type Statement = {
    id: string,
    type: string,
    name?: string,
    content: string,
    short?: string,
    proof?: string,
    depending?: Array<string>,
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
    definition: string = ""
    categories: string[] = []
}
