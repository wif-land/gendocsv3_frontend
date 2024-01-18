import FormHelperText from '@mui/material/FormHelperText'
import { UploadAvatar, Upload, UploadBox, UploadProps } from '../upload'

interface Props extends Omit<UploadProps, 'file'> {
  name: string
  multiple?: boolean
}

export function RHFUploadAvatar({ name, ...other }: Props) {
  return (
    <div>
      <UploadAvatar {...other} />
    </div>
  )
}

export function RHFUploadBox({ name, ...other }: Props) {
  return <UploadBox {...other} />
}

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  return (
    <>
      multiple ? (
      <Upload multiple accept={{ 'image/*': [] }} {...other} />
      ) : (
      <Upload accept={{ 'image/*': [] }} {...other} />)
    </>
  )
}
