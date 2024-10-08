import { getTextWidth, breakLines } from "./text-analysis";

export function getCaretCoordinates(input: HTMLInputElement | HTMLTextAreaElement,
  fontSize: number = 14,
  fontFamily: string = "Arial"
) {
  const { selectionStart } = input;

  if (selectionStart === null) return { top: 0, left: 0, height: fontSize };
  const inputRect = input.getBoundingClientRect();
  // Split the text up to the caret position into lines based on the width of the input
  const text = input.value.slice(0, selectionStart);
  const lines = breakLines(text, inputRect.width, fontSize, fontFamily);

  // The current line is the last one in the array
  const currentLine = lines[lines.length - 1];
  const textWidth = getTextWidth(currentLine);

  // Get the styles applied to the input element
  const computedStyle = window.getComputedStyle(input);

  // Calculate padding, line height, and scroll offset
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize; // default to fontSize if line height is not set
  const scrollLeft = input.scrollLeft;
  const scrollTop = input.scrollTop;

  // Calculate the vertical position by multiplying line height by the number of lines
  const topOffset = paddingTop + lineHeight * (lines.length - 1);

  return {
    top: inputRect.top + topOffset - scrollTop,
    left: inputRect.left + paddingLeft + textWidth - scrollLeft,
    height: lineHeight
  };
}
