import '@blocknote/react/style.css'
import '@/styles/editor.css'

type UpdatesEditorProps = {
  html: string
}

const UpdateRenderer = ({ html }: UpdatesEditorProps) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default UpdateRenderer
