import DatabaseUI from "@components/database-ui/main";


export default function Test() {
  return <DatabaseUI table='statement_dependency'
    columns={{
      id: {},
      name: {
        useLatex: true
      },
      field: {},
      type: {},
      content: {},
      parents: {
        useLatex: true,
        referencing: "name"
      }
    }}></DatabaseUI>
}
