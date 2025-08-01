type Paper = {
  id: string,
  scid: string,
  doi: string | null,
  arxivId: string | null,
  aclId: string | null,
  dblpId: string | null,

  tags: { name: string, color: string }[]

  title: string,
  year: number,
  authors: _Author[],
  abstract?: string | null

  referenceCount: number,
  citationCount: number,

  references: RelatedPaper[] | null,
  citations: RelatedPaper[] | null,

  referenceScids?: string[],
  citationScids?: string[],

  relatedPapers: { references: RelatedPaper[], citations: RelatedPaper[] },
}

type RelatedPaper = Omit<Paper, 'abstract' | 'references' | 'citations'>
type _Author = {
  id: string,
  scid: string,
  name: string,
}



type Field = keyof Paper;

type GraphNode = Paper & {
  x: number, y: number, fx: number | null, fy: number | null
}

type GraphLink = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};