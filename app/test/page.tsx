import MyLatex from "@components/my-latex";

function MyComponent() {
  const str = `Here is some text with a custom macro: $\\QQ$`
  const macros: { [key: string]: string } = {
    "\\QQ": "\\mathbb{Q}"
  }

  return (
    <div>
      <MyLatex >
        {str}
      </MyLatex>
    </div>
  );
}

export default MyComponent;
