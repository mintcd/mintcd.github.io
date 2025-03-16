// 'use client'

// import { useCallback, useState } from "react"
// import { createEditor, Editor, Transforms, Element, Node } from 'slate'
// import { Editable, Slate, withReact } from 'slate-react'
// import Latex from "@components/atoms/latex/EditableLatex"

// const Leaf = props => {
//   console.log(props.children)
//   return (
//     // <Latex
//     //   {...props.attributes}
//     // >
//     //   {props.leaf.text}
//     // </Latex>

//     <span
//       {...props.attributes}
//     >
//       {props.children}
//     </span>
//   )
// }

// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [{ text: `$\\dfrac{1}{2}$` }],
//   },
// ]

// const App = () => {
//   const [editor] = useState(() => withReact(createEditor()))

//   const renderElement = props => {
//     return <div {...props} />
//   }

//   const renderLeaf = useCallback(props => {
//     return <Leaf {...props} />
//   }, [])

//   return (
//     <Slate editor={editor} initialValue={initialValue}>
//       <Editable
//         renderElement={renderElement}
//         renderLeaf={renderLeaf}
//       // onKeyDown={event => {
//       //   if (event.key === '`' && event.ctrlKey) {
//       //     event.preventDefault()
//       //     const [match] = Editor.nodes(editor, {
//       //       match: n => n.type === 'code',
//       //     })
//       //     Transforms.setNodes(
//       //       editor,
//       //       { type: match ? 'paragraph' : 'code' },
//       //       { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
//       //     )
//       //   }
//       // }}
//       />
//     </Slate>
//   )
// }

// export default App