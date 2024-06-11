import { createCanvas } from 'canvas';

export function getTextWidth(text: string, fontSize: number, fontFamily: string) {
  const canvas = createCanvas(200, 200); // Adjust dimensions as needed
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  }
  return 0;
}
