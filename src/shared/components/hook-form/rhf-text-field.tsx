// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField'

type Props = TextFieldProps & {
  name: string
}

export default function RHFTextField({ type, ...other }: Props) {
  return <TextField fullWidth type={type} {...other} />
}
