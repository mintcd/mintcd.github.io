import Fuse from 'fuse.js';
import styles from '@styles/styles'

export function getAllIndices(str: string, char: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      indices.push(i);
    }
  }
  return indices;
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getTextWidth(text: string, fontSize: number = 14, fontFamily: string = "Arial") {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.font = `${fontSize}px ${fontFamily}`;
  div.textContent = text;
  document.body.appendChild(div);
  const width = div.getBoundingClientRect().width;
  document.body.removeChild(div);
  return width;
}

export function getBoundingRect(text: string, maxWidth: number, fontSize: number = styles.fontSize) {
  const textWidth = getTextWidth(text, fontSize)
  const lines = breakLines(text, maxWidth, fontSize)

  return {
    width: lines.length === 1 ? textWidth + 20 : maxWidth,
    height: fontSize * 2
  }

}

// export function getCharacterOffsetWidths(text: string, fontSize: number = 14, fontFamily: string = "Arial") {
//   const canvas = createCanvas(200, 200); // Adjust dimensions as needed
//   const context = canvas.getContext('2d');
//   if (!context) {
//     return [];
//   }

//   context.font = `${fontSize}px ${fontFamily}`;
//   const offsets: number[] = [0];
//   let currentOffset = 0;

//   for (let i = 0; i < text.length; i++) {
//     const char = text[i];
//     const charWidth = context.measureText(char).width;
//     currentOffset += charWidth;
//     offsets.push(currentOffset);
//   }

//   return offsets;
// }

export function filterOnQuery(query: string, data: Term[], keys: string[] = ['name']) {
  return data.filter(term => {
    if (query.trim()) {
      const fuse = new Fuse([term], {
        keys: keys,
        includeScore: true,
        threshold: 0.5,
      });
      const results = fuse.search(query);
      return results.length > 0;
    }
    return true;
  });
}

export function breakLines(text: string, width: number, fontSize: number = 9, fontFamily: string = "Arial"): string[] {

  const lines: string[] = [];
  const endlineSplits = text.split('\n')

  endlineSplits.forEach(line => {
    const words = line.split(" ")

    let currentLine = "";
    words.forEach(word => {
      const testLine = currentLine.length > 0 ? currentLine + ` ` + word : word;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);

      if (testWidth <= width) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    })
    lines.push(currentLine)
  })

  return lines
}

export function removeAt(text: string, from: number, to: number = from + 1) {
  return text.slice(0, from) + text.slice(to);
}

export function insertAt(text: string, what: string, from: number) {
  return text.slice(0, from) + what + text.slice(from);
}

