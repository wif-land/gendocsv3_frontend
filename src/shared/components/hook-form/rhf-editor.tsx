import Editor, { EditorProps } from '../editor'

interface Props extends EditorProps {
  name: string
}

export default function RHFEditor({ name, ...other }: Props) {
  return <Editor id={name} {...other} />
}
