export default [
  {
    name: `Introduction`,
    content: "Hello",
    sections: [
    ]
  },
  {
    name: `Lexical Analysis`,
    content: `Let me write later`,
    sections: []

  },
  {
    name: `Semantic Analysis`,
    content: `A semantic analyzer or a parser converts the sequence of tokens into an Abstract Syntax Tree (AST). Required nodes of an AST are
    <br/>
    1) Abstract nodes: Program, Decl (declaration), Stmt (statement), Expr (expression), Type.
    <br/>
    2) The statement block node: StmtBlock.
    <br/>
    3) The statement block node: StmtBlock.
    `,
    sections: []
  },
  {
    name: `Intermediate Representation Optimization`,
    content: `Let me write later`,
    sections: [
      {
        name: `Information Assignment`,
        content: `In this first subphase of Intermediate Representation Optimization (or AST Optimization), we assign sufficient information to relevant nodes of the AST to avoid complicated further parent-child parameter passing in visit functions, including
        <br/>
        1) A unique id to each statement
        <br/>
        2) The parent block of each statement
        <br/>
        3) The statement of each expression
        This component may be called for any AST during optimization to update the information.
        `
      },
      {
        name: `Statement Unwrapping`,
        content: `Upwrap each composite statement (such as concurrent declaration for multiple variables) into single statement.`
      },
      {
        name: `Scope justification`,
        content: `Rename symbols of the same name but in different scopes, due to redeclare.`
      },
      {
        name: `Binary Expression Unwrapping`,
        content: `Upwrap each composite binary expression in single ones, for example $a = b + c + d$ to $t_0 = b + c$ and $a = t_0 + d$.`
      },

    ]
  },
  {
    name: `Flow Analysis`,
    content: `Create the Control Flow Graph (CFG) for the optimized AST. Carefully deal with branch statements like IfStmt, ForStmt and WhileStmt.`,
    sections: []
  },
] as Chapter[]