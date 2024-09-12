import DatabaseUI from "@components/database-ui/main";


export default function Test() {
  return <DatabaseUI table='Statement Dependency'
    columns={{
      id: {},
      name: {
        useLatex: true
      },
      field: {},
      type: {},
      content: {},
      parents: {
        useLatex: true
      }
    }}></DatabaseUI>
}
