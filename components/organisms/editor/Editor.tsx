'use client';

import { useEffect, useState } from "react";
import { AtomProps, Selection } from "./types";
import { removeAt, insertAt } from "@functions/text-analysis";
import { useClickAway } from "@uidotdev/usehooks";
import { adjustedSelection, selectedLetterIndex, cleanedContent } from "./utils";
import Atom from "./Atom";

export default function Editor() {
  const [focused, setFocused] = useState(false)
  const [selection, setSelection] = useState<Selection>({
    from: {
      id: 0,
      offset: 0
    },
    to: {
      id: 0,
      offset: 0
    },
  });

  // Track if the mouse is down
  const [atoms, setAtoms] = useState<AtomProps[]>([{ type: 'text', text: "Hello " }, { type: 'text', text: "Welcome" }])

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [contentChanged, setContentChanged] = useState(Math.random())
  const ref = useClickAway(() => Object.keys(selection).length > 0
    && setFocused(false)) as any


  const atomListeners = (id: number) => (
    {
      onMouseDown: (e: React.MouseEvent<HTMLSpanElement>) => {
        setFocused(true)
        setIsMouseDown(true);
        const selectionIndex = selectedLetterIndex(e);

        selectionIndex === 0 && id > 0 ?
          setSelection({
            from: {
              id: id - 1,
              offset: atoms[id - 1].text.length
            },
            to: {
              id: id - 1,
              offset: atoms[id - 1].text.length
            },
          }) :
          setSelection({
            from: {
              id: id,
              offset: selectionIndex
            },
            to: {
              id: id,
              offset: selectionIndex
            },
          })
      },
      onMouseMove: (e: React.MouseEvent<HTMLSpanElement>) => {
        if (isMouseDown === false || selection.from === undefined || selection.to === undefined)
          return

        // console.log(selection)

        const selectionIndex = selectedLetterIndex(e);

        if (id > selection.from.id || id == selection.from.id && selectionIndex > selection.from.offset) {
          setSelection({
            ...selection,
            to: {
              id: id,
              offset: selectionIndex
            }
          });
        } else {
          setSelection({
            ...selection,
            from: {
              id: id,
              offset: selectionIndex
            }
          });
        }

      },

      onMouseUp: (e: React.MouseEvent<HTMLSpanElement>) => {
        setIsMouseDown(false);
      }
    }
  )

  const moleculeListeners: Listeners = {
    onKeyDown: (e) => {
      if (e.ctrlKey) {
        if (e.key == "b") {
          // console.log(selection)
          if (selection.from.id === selection.to.id) {
            const atom = atoms[selection.from.id]

            setAtoms(cleanedContent([
              ...atoms.slice(0, selection.from.id),
              {
                text: atom.text.slice(selection.from.offset, selection.to.offset),
                style: atom.style?.includes("bold")
                  ? atom.style.filter(s => s !== "bold")
                  : [...atom.style || [], "bold"],
              },
              {
                ...atoms[0],
                text: atoms[selection.from.id].text.slice(selection.to.offset),
              },

              ...atoms.slice(selection.from.id + 1)

            ]))

            setSelection(adjustedSelection({
              from: {
                id: selection.from.id + Number(selection.from.offset > 0),
                offset: 0
              },
              to: {
                id: selection.from.id + Number(selection.from.offset > 0),
                offset: atoms[selection.from.id].text.slice(selection.from.offset, selection.to.offset).length
              }
            }, atoms))
          }

          else {
            const allBolded = atoms
              .slice(selection.from.id + atoms[selection.from.id].text.length === selection.from.offset ? 1 : 0,
                selection.to.id + 1)
              .every((atom) => atom.style?.includes('bold'))

            const modifiedText = atoms[selection.from.id].text.slice(selection.from.offset)
              + atoms
                .filter((atom, index) => index > selection.from.id && index < selection.to.id)
                .map(atom => atom.text).join("")
              + atoms[selection.to.id].text.slice(0, selection.to.offset)

            setAtoms(cleanedContent([
              ...atoms.slice(0, selection.from.id),
              ...(selection.from.offset !== 0 ? [{
                ...atoms[selection.from.id],
                text: atoms[selection.from.id].text.slice(0, selection.from.offset)
              }] : []),
              {
                text: modifiedText,
                style: allBolded ? atoms[selection.from.id].style?.filter(s => s !== 'bold')
                  : [...atoms[selection.from.id].style || [], 'bold'],
              },
              {
                ...atoms[selection.to.id],
                text: atoms[selection.to.id].text.slice(selection.to.offset),
              },
              ...atoms.slice(selection.to.id + 1)
            ]))

            setSelection(adjustedSelection(
              {
                from: {
                  id: selection.from.id + Number(selection.from.offset > 0),
                  offset: 0
                },
                to: {
                  id: selection.from.id + Number(selection.from.offset > 0),
                  offset: modifiedText.length
                },
              }, atoms
            ))


          }
        }
        return
      }

      if (e.key === "ArrowLeft") {
        if (selection.from.offset > 0) {
          setSelection({
            from: {
              id: selection.from.id,
              offset: selection.from.offset - 1
            },
            to: {
              id: selection.from.id,
              offset: selection.from.offset - 1
            },
          })
        } else {
          if (selection.from.id > 0) {
            setSelection({
              from: {
                id: selection.from.id - 1,
                offset: atoms[selection.from.id - 1].text.length - 1
              },
              to: {
                id: selection.from.id - 1,
                offset: atoms[selection.from.id - 1].text.length - 1
              },
            })
          }
        }
      }

      if (e.key === "ArrowRight") {
        if (selection.from.offset < atoms[selection.from.id].text.length) {
          setSelection({
            from: {
              id: selection.from.id,
              offset: selection.from.offset + 1
            },
            to: {
              id: selection.from.id,
              offset: selection.from.offset + 1
            },
          })
        } else {
          setSelection({
            from: {
              id: selection.from.id + 1,
              offset: 1
            },
            to: {
              id: selection.from.id + 1,
              offset: 1
            },
          })
        }
      }

      if (e.key === "Backspace") {
        console.log(selection)
        setSelection({
          from: {
            id: selection.from.id,
            offset: selection.from.offset - 1
          },
          to: {
            id: selection.from.id,
            offset: selection.from.offset - 1
          },
        })

        setAtoms(cleanedContent(
          [...atoms.slice(0, selection.from.id),
          {
            ...atoms[selection.from.id],
            text: removeAt(atoms[selection.from.id].text, selection.from.offset - 1)
          },
          ...atoms.slice(selection.from.id + 1)]
        ))
      }

      // Characters
      if (e.key.length === 1 || e.key === 'Space') {
        setContentChanged(Math.random())
        setSelection({
          from: {
            id: selection.from.id,
            offset: selection.from.offset + 1
          },
          to: {
            id: selection.from.id,
            offset: selection.from.offset + 1
          }
        });

        let newText = insertAt(atoms[selection.from.id].text, e.key, selection.from.offset)
        if (atoms[selection.from.id].type === 'latex') {
          newText = newText.trim()
        }


        setAtoms(
          [...atoms.slice(0, selection.from.id), {
            ...atoms[selection.from.id],
            text: newText
          },
          ...atoms.slice(selection.from.id + 1)])
      }
    },
  }



  useEffect(() => {

    const currentAtom = atoms[selection.from.id];

    if (currentAtom.type === 'latex') return

    const regex = /\$(.*?)\$/g;
    const matches = [...currentAtom.text.matchAll(regex)];

    if (matches.length > 0) {

      matches.forEach((match) => {
        const fullMatch = match[0]; // The full match including the dollar signs
        const startPos = match.index; // Position of the first dollar sign
        const endPos = match.index + fullMatch.length - 1; // Position of the second dollar sign
        console.log(fullMatch)

        const latexAtom: AtomProps = {
          type: 'latex',
          text: fullMatch
        }

        setAtoms([
          ...atoms.slice(0, selection.from.id),
          {
            ...atoms[selection.from.id],
            text: atoms[selection.from.id].text.substring(0, startPos)
          },
          latexAtom,
          {
            ...atoms[selection.from.id],
            text: atoms[selection.from.id].text.substring(endPos + 1)
          },
          ...atoms.slice(selection.from.id + 1)
        ])

        setSelection({
          from: {
            id: selection.from.id + 1,
            offset: atoms[selection.from.id].text.substring(0, startPos).length
          },
          to: {
            id: selection.from.id + 1,
            offset: atoms[selection.from.id].text.substring(0, startPos).length
          },
        })

      });
    }
  }, [contentChanged]);

  // console.log(selection)

  return (
    <div className="editor flex items-center"
      style={{ width: 300, height: 100, backgroundColor: 'gray' }}>
      <div className="atoms-container outline-none"
        ref={ref}
        tabIndex={0}
        {...moleculeListeners}
      >
        {atoms.map((atom, index) => (
          <span
            className={`${atom.type}${atom.style?.includes("bold") ? 'font-bold' : ''}`}
            key={index}
            {...atomListeners(index)}
            style={{ userSelect: 'none', cursor: 'text', whiteSpace: 'pre' }}
          >
            <Atom id={index} props={atom} selection={focused ? selection : undefined} />
          </span>
        ))}
      </div>
    </div>
  );
}
