import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel, {
  FormControlLabelProps,
  formControlLabelClasses,
} from '@mui/material/FormControlLabel'

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string
  helperText?: React.ReactNode
}

export const RHFCheckbox = ({ ...other }: RHFCheckboxProps) => (
  <div>
    <FormControlLabel control={<Checkbox checked={true} />} {...other} />
  </div>
)

interface RHFMultiCheckboxProps
  extends Omit<FormControlLabelProps, 'control' | 'label'> {
  name: string
  options: { label: string; value: any }[]
  row?: boolean
  label?: string
  spacing?: number
  helperText?: React.ReactNode
}

export const RHFMultiCheckbox = ({
  row,
  label,
  options,
  spacing,
  sx,
  ...other
}: RHFMultiCheckboxProps) => {
  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item]

  return (
    <FormControl component="fieldset">
      {label && (
        <FormLabel component="legend" sx={{ typography: 'body2' }}>
          {label}
        </FormLabel>
      )}

      <FormGroup
        sx={{
          ...(row && {
            flexDirection: 'row',
          }),
          [`& .${formControlLabelClasses.root}`]: {
            '&:not(:last-of-type)': {
              mb: spacing || 0,
            },
            ...(row && {
              mr: 0,
              '&:not(:last-of-type)': {
                mr: spacing || 2,
              },
            }),
          },
          ...sx,
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={<Checkbox checked={true} />}
            label={option.label}
            {...other}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
