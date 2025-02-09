import { getCharacterOffsetWidths } from "@functions/text-analysis";
import { containsSameElements } from "@functions/array";
import { AtomProps, Selection } from "./types";

export function range(start: number, end: number, step: number = 1): number[] {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

export function selectedLetterIndex(e: React.MouseEvent<HTMLSpanElement>) {
  const container = e.currentTarget;
  const text = container.innerText
  const bound = container.getBoundingClientRect()

  const childOffsetX = e.clientX - bound.left;
  const characterOffsets = getCharacterOffsetWidths(text);
  const differences = characterOffsets.map(offset => Math.abs(offset - childOffsetX));

  return differences.indexOf(Math.min(...differences));
}

export function adjustedSelection(selection: Selection, atoms: AtomProps[]) {
  return selection.from.id > 0 && selection.from.offset === 0 ?
    {
      from: {
        id: selection.from.id - 1,
        offset: atoms[selection.from.id - 1].text.length
      },
      to: selection.to
    } :
    selection
}

export function cleanedContent(content: AtomProps[], selection: Selection) {
  // If an atom have the same style as its neighbor, merge them
  let index = 0
  let cleanedContent = []

  while (index < content.length - 1) {
    const currentAtom = content[index];
    if (currentAtom.text.length === 0) continue

    for (const i of range(index + 1, content.length - 1)) {
      const nextAtom = content[i + 1]

      if (containsSameElements(currentAtom.style || [], nextAtom.style || []) && currentAtom.type === nextAtom.type) {
        content[index].text += nextAtom.text
        index = i
      }
      else break
    }
    cleanedContent.push(currentAtom)
    index += 1
  }
  return content
}

