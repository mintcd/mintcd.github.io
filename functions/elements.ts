export function getCaretCoordinates(input: HTMLInputElement | HTMLTextAreaElement) {

  const { selectionStart } = input;

  // Create a temporary span to measure the width of the text
  const span = document.createElement("span");
  const text = input.value.substring(0, selectionStart || 0);
  const computedStyle = window.getComputedStyle(input);

  // Set the span's font styles to match the input
  span.style.font = computedStyle.font;
  span.style.whiteSpace = "pre"; // Keep whitespaces
  span.textContent = text || ' '; // Add a space for empty text to show the caret position

  // Append the span to the body to calculate its dimensions
  document.body.appendChild(span);

  const { offsetWidth, offsetHeight } = span;
  const coordinates = {
    top: input.getBoundingClientRect().top + window.scrollY,
    left: input.getBoundingClientRect().left + window.scrollX + offsetWidth
  };

  // Clean up the temporary span
  document.body.removeChild(span);

  return {
    top: coordinates.top,
    left: coordinates.left,
    height: offsetHeight
  };
}
