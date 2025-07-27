import { useEffect, useState } from "react";
import { fetchFromNotionDatabase, fetchPapers } from "./utils";

export function useFetchData() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const nodes: GraphNode[] = await fetchPapers();
      const authors = await fetchFromNotionDatabase("authors") as _Author[];

      const authorsById = authors.reduce((acc, author) => {
        acc[author.id] = author;
        return acc;
      }, {} as { [id: string]: _Author });

      for (const node of nodes) {
        for (const author of node.authors ?? []) {
          author.name = authorsById[author.id]?.name;
        }
      }

      const links: GraphLink[] = [];
      for (const item of nodes) {
        for (const target of item.references ?? []) {
          links.push({ source: item.id, target: target.id });
        }
      }

      setData({ nodes, links });
      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading, setData };
}
