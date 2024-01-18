import FormHelperText from '@mui/material/FormHelperText'
import Slider, { SliderProps } from '@mui/material/Slider'

type Props = SliderProps & {
  name: string
  helperText?: React.ReactNode
}

export default function RHFSlider({ name, helperText, ...other }: Props) {
  return (
    <>
      <Slider valueLabelDisplay="auto" {...other} />
    </>
  )
}
