type Macros = { [name: string]: string };

type KatexData = {
  data: string;
  type: string;
  rawData?: string;
  display?: boolean;
}

type Delimiter = {
  right: string;
  left: string;
  display: boolean;
}


type LatexProps = {
  children: string;
  delimiters?: Delimiter[];
  strict?: boolean;
  macros?: Macros;
  width?: string | number;
  height?: string | number;
}