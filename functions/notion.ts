const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const getUsers = async () => {
  const listUsersResponse = await notion.users.list({})
}