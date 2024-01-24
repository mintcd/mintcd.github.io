import React, { useEffect, useRef, useState } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';


function Node(props: GraphNode) {
    const typeClassNames = {
        theorem: 'bg-[#C3E3E7]',
        definition: 'bg-[#c4e0b0]',
        lemma: 'bg-[#FFD9B7]'
    };

    const typeClassName = (typeClassNames as { [key: string]: string })[props.type] || '';

    return (
        <div
            className={`flex text-sm border-grey ${`bg-${props.color}-${props.opacity}`} border-solid border-2 rounded-[50%] p-3 m-[20px] hover:opacity-50 cursor-pointer max-w-[200px] justify-center items-center text-center ${typeClassName} aspect-auto`}
        >
            <Latex>{`${props.label} ${props.content}`}</Latex>
        </div>
    );
}

Node.defaultProps = {
    label: "",
    content: "",
    color: "blue",
    opacity: "200",
    type: "text"
}

export default function Graph() {
    const nodeRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>({});
    const [positions, setPositions] = useState({})

    useEffect(() => {
        console.log(edges)
        for (const nodeId in nodeRefs.current) {
            const nodeRef = nodeRefs.current[nodeId];
            if (nodeRef.current) {
                const nodeHeight = nodeRef.current.offsetHeight;
                const nodeWidth = nodeRef.current.offsetWidth;
                console.log(`Node ${nodeId} - Height: ${nodeHeight}px, Width: ${nodeWidth}px`);
            }
        }
    }, []); // Empty dependency array to run the effect once

    const nodes = [
        {
            id: 1, label: "1"
        },
        {
            id: 2, label: "2"
        },
        {
            id: 3, label: "3"
        },
    ];

    const edges = [
        { src: 1, des: 2 }
    ]

    return (
        <div>
            <Xwrapper>
                {nodes.map(node => {
                    const nodeRef = React.createRef<HTMLDivElement>(); // Create a ref for each node
                    nodeRefs.current[node.id] = nodeRef; // Assign the ref to the nodeRefs object
                    return (
                        <div className="absolute w-max left-[200px]" key={node.id} ref={nodeRef}> {/* Assign the ref to the div */}
                            <Node nodeId={node.id} label={node.label} />
                        </div>
                    );
                })}
            </Xwrapper>
        </div>
    );
}



