import { createCanvas } from 'canvas';

export function CapitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getTextWidth(text: string, fontSize: number = 16, fontFamily: string = "Arial") {
  const canvas = createCanvas(200, 200); // Adjust dimensions as needed
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  }
  return 0;
}
