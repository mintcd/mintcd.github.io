"use client"

import absalg from '@models/absalg';

export default function Graph() {
    const theorems = absalg.flatMap(item => item.theorems).filter(theorem => theorem.id.includes("."));
    const dependencies = theorems.flatMap((item) => item.depending.map((depended) => [depended, item.id]));

    return (
        <div className='grid grid-cols-3'>
            Hello from Abstract algebra
        </div>
    );
}
