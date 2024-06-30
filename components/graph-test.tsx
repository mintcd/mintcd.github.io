'use client'

import { useRef, useEffect, useState } from 'react';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import VertexContent from '@components/statement-content';
import cytoscape from 'cytoscape';

import { statementProps } from '@styles/statement-props';
import Latex from '@components/latex';
import { breakLinesForCircle, getEdges } from '@functions/graph-analysis';

export default function KnowledgeGraph({ graph, radius = 30, fontSize = 9, lectureView = false }: { graph: Vertex[], radius?: number, fontSize?: number, lectureView?: boolean }) {

  const graphRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(null);

  const [graphRendered, setGraphRendered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shownContent, setShownContent] = useState<Vertex | null>(null)
  const graphSize = {
    width: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.width * 0.9 : 500,
    height: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : 500,
  }

  let vertices: Vertex[] = breakLinesForCircle(graph, radius, fontSize, "Arial") as Vertex[];
  let edges = getEdges(graph);

  useEffect(() => {
    if (!graphRef.current) return;

    const cy = cytoscape({
      container: graphRef.current,
      elements: [
        ...vertices.map(vertex => ({
          data: {
            id: vertex.key,
            ...vertex,
            color: vertex.color || statementProps[vertex.type].color
          }
        })),
        ...edges.map(edge => ({
          data: {
            id: `${edge.source}-${edge.target}`,
            ...edge
          }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(name)',
            'width': radius * 2,
            'height': radius * 2,
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': fontSize,
            'color': 'white',
            'text-wrap': 'wrap',
            // 'text-max-width': radius * 2
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#aaa',
            'target-arrow-color': '#aaa',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: () => radius * 4,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: () => 400000,
        edgeElasticity: () => 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });

    cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      const vertex = node.data();
      if (vertex.href && !lectureView) {
        window.open(vertex.href, '_blank');
      } else {
        setShownContent(vertex);
      }
    });

    cy.on('mouseover', 'node', function (evt) {
      if (!lectureView) {
        const node = evt.target;
        const vertex = node.data();
        setShownContent(vertex);
        const pos = evt.renderedPosition;
        setMousePosition({
          x: pos.x + graphRef.current!.getBoundingClientRect().left,
          y: pos.y + graphRef.current!.getBoundingClientRect().top
        });
      }
    });

    cy.on('mouseout', 'node', function () {
      if (!lectureView) {
        setShownContent(null);
      }
    });

    const resetZoom = () => {
      cy.fit();
      cy.center();
    };

    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', resetZoom);
    }

    setGraphRendered(true);

    return () => {
      cy.destroy();
      if (resetButton) {
        resetButton.removeEventListener('click', resetZoom);
      }
    };
  }, [graphRendered]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !(contentRef.current as HTMLElement).contains(event.target as Node)) {
        setShownContent(null);
      }
    }

    function escHandler(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShownContent(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', escHandler);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', escHandler);
    };
  }, []);

  return (
    <div className='grid grid-cols-5 place-items-center'>
      <div className={`${lectureView ? 'col-span-3' : 'col-span-5'} w-[90%] 
                      flex flex-col items-center justify-center 
                      bg-slate-200 overflow-hidden`}>
        <CenterFocusStrongRoundedIcon id='reset-button' className='cursor-pointer bg-transparent self-start m-4 w-10 h-10' />
        <div ref={graphRef} style={{ width: '100%', height: '500px' }}></div>
      </div>

      {shownContent !== null && shownContent.content && (lectureView
        ?
        <div
          className={`col-span-2 z-50 rounded-md 
                      animate-fadeIn mr-5 h-full w-full`}
          ref={contentRef}
        >
          <VertexContent statement={shownContent} />
        </div>
        :
        <div
          className={`z-50 rounded-md 
         animate-fadeIn p-5 max-w-[600px]
        `}
          style={{
            position: 'fixed',
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`
          }}
          ref={contentRef}
          onMouseEnter={() => setShownContent(shownContent)}
          onMouseLeave={() => setShownContent(null)}
        >
          <VertexContent statement={shownContent} />
        </div>)
      }
    </div>
  );
}