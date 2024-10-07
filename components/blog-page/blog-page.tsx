'use client'

import { TextField } from "@components/atoms"
import Latex from "@components/latex"
import { fetchData, updateOne } from "@functions/database"
import Markdown from 'react-markdown'

export default function BlogPage({ title }: {
  title: string
}) {

  async function handleUpdate(content: string) {
    await fetchData({ table: 'blog', })
    await updateOne("blog", 1, { content: content })
  }

  return (
    <div className="">
      <div className="title bg-gray-400 h-[60vh] mb-5">

      </div>

      <div className="body bg-gray-300 h-[120vh]">
        <TextField type="text" onUpdate={handleUpdate} updateOnEnter={false} />
      </div>
    </div>
  )
}