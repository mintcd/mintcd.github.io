import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import linalg from '@models/linalg';

export default function Chapter() {

    const theorem41 = linalg.find(item => item.chapter == 4)?.statements.find(statement => statement.id == '4.1')

    return (
        // <div className="ml-4">
        //     This chapter shows the construction of the determinant of a set of vectors, a linear transformation, and more specifically that of a matrix. <br /><br />

        //     <div className="border rounded p-4 bg-blue-100 mb-4">
        //         <span className="text-lg font-semibold mb-2"> Definition. </span>
        //         <Latex>
        //             {linalg.find(item => item.chapter == 4)?.statements.find(statement => statement.id == '1')?.content}
        //         </Latex>
        //     </div>


        //     {/* <div className="border rounded p-4 bg-green-100 mb-4">
        //         <span className="text-lg font-semibold mb-2"> Theorem. </span>
        //         <Latex>{theorem41.content}</Latex>
        //     </div>

        //     <i> Proof. </i>
        //     <Latex>{theorem41.proof}</Latex> */}


        //     <div className="border rounded p-4 bg-blue-100 mb-4">
        //         <span className="text-lg font-semibold mb-2"> Definition. </span>
        //         <Latex>
        //             {linalg.find(item => item.chapter == 4)?.statements.find(statement => statement.id == '2')?.content}
        //         </Latex>
        //     </div>
        // </div>
        <div> Developing... </div>
    )
}