"use client"

import topology from '@models/topology';

export default function Graph() {
    const statements = topology.flatMap(item => item.statements)
    const dependencies = statements.flatMap((item) => item.depending.map((depended) => [depended, item.id]));

    return (
        <div className='grid grid-cols-3 text-sm'>
            Hello from Topology
        </div>
    );
}


