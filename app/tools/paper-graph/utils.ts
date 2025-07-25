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

export async function fetchFromSemanticScholar(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/semantic-scholar/paper?id=${id}`);
  if (!res.ok) throw res; // ← throw entire Response object
  return res.json();
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

export async function fetchFromNotionDatabase(database: string, filter?: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/${database}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get',
      ...(filter && { filter }),
    }),
  });

  if (!res.ok) throw res;
  return res.json();
}

export async function addToNotionDatabase(paper: any) {
  // First check if paper already exists
  const searchPaperRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/papers`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get',
        filter: {
          property: 'scid',
          rich_text: {
            equals: paper.paperId,
          },
        },
      }),
    }
  );

  if (!searchPaperRes.ok) throw searchPaperRes;

  const existingPapers = await searchPaperRes.json();
  if (existingPapers.length > 0) return;

  const authors = paper.authors ?? [];
  const authorPageIds: string[] = [];

  for (const author of authors) {
    const authorData = {
      scid: author.authorId,
      name: author.name,
    };

    const searchRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/authors`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get',
          filter: {
            property: 'scid',
            rich_text: {
              equals: authorData.scid,
            },
          },
        }),
      }
    );

    if (!searchRes.ok) throw searchRes;

    const existingAuthors = await searchRes.json();
    let authorPageId: string;

    if (existingAuthors.length > 0) {
      authorPageId = existingAuthors[0].id;
    } else {
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          ...authorData,
        }),
      });

      if (!createRes.ok) throw createRes;

      authorPageId = (await createRes.json()).id;
    }

    authorPageIds.push(authorPageId);
  }

  // Construct paper object and send "add" request
  const paperNode = {
    scid: paper.paperId,
    doi: paper.externalIds?.DOI ?? '',
    arxivId: paper.externalIds?.ArXiv ?? '',
    aclId: paper.externalIds?.ACL ?? '',
    dblpId: paper.externalIds?.DBLP ?? '',

    title: paper.title,
    year: paper.year,
    citationCount: paper.citationCount,
    referenceCount: paper.referenceCount,
    status: paper.status,
    authors: authorPageIds,
  };

  const dbRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/databases/papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'add',
      ...paperNode,
    }),
  });

  if (!dbRes.ok) throw dbRes;

  const { id: pageId } = await dbRes.json();

  if (paper.abstract?.length > 0) {
    const contentRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/blocks/${pageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: paper.abstract }),
    });

    if (!contentRes.ok) throw contentRes;
  }

  return { id: pageId, ...paperNode };
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

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}