"use client"

import Xarrow, { Xwrapper } from 'react-xarrows';
import linalg from '@models/linalg';
import 'katex/dist/katex.min.css';


export default function Graph() {
    const statements = linalg.flatMap(item => item.statements).filter(statement => statement.type === "theorem")
    const dependencies = statements.flatMap((item) => item.depending.map((depended) => [depended, item.id]));

    return (
        <div className='flex flex-wrap'>
            Hello from Linear algebra
        </div>
    );
}