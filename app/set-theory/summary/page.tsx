"use client"

import Xarrow, { Xwrapper } from 'react-xarrows';
import linalg from '@models/linalg';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { forwardRef } from 'react';

export default function Graph() {
    const statements = linalg.flatMap(item => item.statements)
    // const dependencies = statements.flatMap((item) => item.depending.map((depended) => [depended, item.id]));

    return (
        <div className='grid grid-cols-3'>
            <Xwrapper>
                {statements.map((item) => (
                    <Block id={item.id} item={item} includeId={true} includeName={true} />
                ))}
                {/* {dependencies.map((item) => (
                    <Xarrow startAnchor='auto' endAnchor='auto' headSize={4} start={item[0]} end={item[1]} />
                ))} */}
            </Xwrapper>
        </div>
    );
}


const Block = ({ id, item, includeId, includeName }:
    { id: string, item: Statement, includeId: boolean, includeName: boolean }) => {
    const typeClassNames = {
        theorem: 'bg-[#C3E3E7]',
        definition: 'bg-[#c4e0b0]',
        lemma: 'bg-[#FFD9B7]'
    };

    function handleClick() {
        console.log(`Proof of`, id);
    }

    const typeClassName = (typeClassNames as { [key: string]: string })[item.type] || '';

    let content = `${includeId ? `$$\\textbf{${(item.type.charAt(0).toUpperCase() + item.type.slice(1))} ${id}}$$` : ""} 
                    ${includeName && item.name && `$\\textbf{${item.name}.}$` || ""} ${item.short || item.content}`;


    return (
        <div
            id={id}
            className={`border-grey border-solid border-2 rounded-[20px] p-5 my-5 mx-[20px] hover:opacity-50 ${typeClassName}`}
            onClick={handleClick}
        >
            <Node content={content} />
        </div>
    );
};

const Node = forwardRef<HTMLDivElement, { content: string }>(({ content }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[1/4] flex items-center justify-center text-justify text-sm"
        >
            <Latex>{content}</Latex>
        </div>
    );
});