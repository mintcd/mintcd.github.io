import DatabaseUI from "@components/database-ui/main";


export default function Test() {
  return <DatabaseUI table='statements'
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
    }}></DatabaseUI>
}
