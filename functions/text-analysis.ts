export function getTextWidth(text: string, fontSize: number, fontFamily: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontSize}px ${fontFamily}`;
    const width = context.measureText(text).width;
    return width
  }
  return 200;
}