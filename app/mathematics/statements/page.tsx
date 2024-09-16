import DatabaseUI from "@components/database-ui/main";


export default function Test() {
  return <DatabaseUI table='statement'
    columns={{
      id: {},
      name: {
        useLatex: true
      },
      fields: {},
      type: {},
      content: {},
      parents: {
        useLatex: true,
        referencing: "name"
      },
      proof: {}
    }}>

  </DatabaseUI>
}
