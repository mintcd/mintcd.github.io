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
    dashedStatementName?: string,
    short?: string,
    content: string,
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

type Notation = {
    name: string,
    content: string
}

type StatementType = 'axiom' | 'theorem' | 'definition' | 'corollary' | 'lemma' | 'note' | 'thoughtBubble' | 'example';
