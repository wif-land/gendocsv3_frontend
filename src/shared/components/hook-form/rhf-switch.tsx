import Switch from '@mui/material/Switch'
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'

interface Props extends Omit<FormControlLabelProps, 'control'> {
  name: string
  helperText?: React.ReactNode
}

export default function RHFSwitch({ name, helperText, ...other }: Props) {
  return (
    <div>
      <FormControlLabel control={<Switch checked={true} />} {...other} />
    </div>
  )
}
