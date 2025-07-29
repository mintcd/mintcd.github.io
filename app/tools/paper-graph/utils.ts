export async function searchFromSemanticScholar(query: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/semantic-scholar/completion?q=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    console.error(`Server error: ${res.status}`);
    return []
  }

  const data = await res.json();
  return data;
}

export async function fetchFromSemanticScholar(id: string): Promise<Paper> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/semantic-scholar/paper?id=${id}`);
  if (!res.ok) throw res; // ← throw entire Response object
  return res.json();
}

export async function findWithScid(scid: string, db: 'papers' | 'authors'): Promise<Paper | _Author | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/${db}?action=get`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filter: {
          property: 'scid',
          rich_text: {
            equals: scid,
          },
        },
      }),
    }
  );

  if (!res.ok) throw res;

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function updateNotionPage(id: string, properties: { [key: string]: any }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(properties),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update Notion: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function fetchNotionPage(id: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/pages/${encodeURIComponent(id)}`;
  const res = await fetch(endpoint);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to fetch page ${id}: ${error?.error ?? res.statusText}`);
  }

  return res.json();
}

export async function fetchNotionBlock(id: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/blocks/${encodeURIComponent(id)}`;
  const res = await fetch(endpoint);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to fetch page ${id}: ${error?.error ?? res.statusText}`);
  }

  return res.json();
}

export async function fetchFromNotionDatabase(db: 'papers' | 'authors', filter?: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/${db}?action=get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...(filter && { filter }),
    }),
  });

  if (!res.ok) throw res;
  return res.json();
}

export async function fetchPapers() {
  let papers = await fetchFromNotionDatabase('papers');

  papers = await Promise.all(papers.map(async (paper: any) => {
    const contents = await fetchNotionBlock(paper.id);
    paper.abstract = contents?.abstract ?? null;
    paper.referenceScids = contents?.referenceScids ?? [];
    paper.citationScids = contents?.citationScids ?? [];
    return paper;
  }));

  return papers;
}

export async function addToNotionDatabase(paper: Paper) {
  const paperInNotion = await findWithScid(paper.scid, 'papers');
  if (paperInNotion) return paperInNotion;

  const authors = paper.authors ?? [];
  const notionAuthors: { id: string }[] = [];

  for (const author of authors) {
    const notionAuthor = await findWithScid(author.scid, 'authors');
    let authorPageId: string;

    if (notionAuthor) {
      authorPageId = notionAuthor.id;
    } else {
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/authors?action=add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(author),
      });

      if (!createRes.ok) throw createRes;
      authorPageId = (await createRes.json()).id;
    }

    notionAuthors.push({ id: authorPageId });
  }

  const paperNode = {
    title: paper.title,
    year: paper.year,
    citationCount: paper.citationCount,
    referenceCount: paper.referenceCount,
    doi: paper.doi,
    arxivId: paper.arxivId,
    aclId: paper.aclId,
    dblpId: paper.dblpId,
    scid: paper.scid,
    authors: notionAuthors,
  };

  const dbRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/papers?action=add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paperNode),
  });
  if (!dbRes.ok) throw dbRes;

  const addedPaper = await dbRes.json();

  console.log(addedPaper)

  const referenceScids = paper.references?.map(ref => ref.scid) ?? []
  const citationScids = paper.citations?.map(ref => ref.scid) ?? []

  const blockContent = JSON.stringify({
    abstract: paper.abstract ?? null,
    referenceScids, citationScids
  }, null, 2);


  const contentRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/blocks/${addedPaper.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: blockContent }),
  });

  console.log(await contentRes.json())

  return { ...paper, id: addedPaper.id, referenceScids, citationScids };
}

export function getOpenUrl(paper: any): string | null {
  if (paper.arxivId) {
    return `https://arxiv.org/abs/${paper.arxivId}`;
  }
  if (paper.doi) {
    return `https://doi.org/${paper.doi}`;
  }
  if (paper.dblpId) {
    return `https://dblp.org/rec/${paper.dblpId}`;
  }
  if (paper.aclId) {
    return `https://aclanthology.org/${paper.aclId}`;
  }
  if (paper.scid) {
    return `https://www.semanticscholar.org/paper/${paper.scid}`;
  }
  return null;
}

export function getPdf(paper: any): string | null {
  if (paper.arxivId) {
    return `https://arxiv.org/pdf/${paper.arxivId}.pdf`;
  }
  if (paper.aclId) {
    return `https://aclanthology.org/${paper.aclId}.pdf`;
  }
  if (paper.doi) {
    return `https://dl.acm.org/doi/pdf/${paper.doi}`
  }
  return null;
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}