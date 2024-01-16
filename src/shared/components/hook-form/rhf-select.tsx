import { Theme, SxProps } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectProps } from '@mui/material/Select'
import TextField, { TextFieldProps } from '@mui/material/TextField'

type RHFSelectProps = TextFieldProps & {
  name: string
  native?: boolean
  maxHeight?: boolean | number
  children: React.ReactNode
  PaperPropsSx?: SxProps<Theme>
}

export const RHFSelect = ({
  native,
  maxHeight = 220,
  children,
  PaperPropsSx,
  ...other
}: RHFSelectProps) => (
  <TextField
    select
    fullWidth
    SelectProps={{
      native,
      MenuProps: {
        PaperProps: {
          sx: {
            ...(!native && {
              maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
            }),
            ...PaperPropsSx,
          },
        },
      },
      sx: { textTransform: 'capitalize' },
    }}
    {...other}
  >
    {children}
  </TextField>
)

type RHFMultiSelectProps = SelectProps & {
  name: string
  label?: string
  chip?: boolean
  checkbox?: boolean
  placeholder?: string
  helperText?: React.ReactNode
  options: {
    label: string
    value: string
  }[]
}

export const RHFMultiSelect = ({
  name,
  label,
  options,
  checkbox,
  placeholder,
  sx,
  ...other
}: RHFMultiSelectProps) => (
  <FormControl sx={sx}>
    {label && <InputLabel id={name}> {label} </InputLabel>}

    <Select displayEmpty={!!placeholder} labelId={name} {...other}>
      {placeholder && (
        <MenuItem disabled value="">
          <em> {placeholder} </em>
        </MenuItem>
      )}

      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {checkbox && <Checkbox size="small" disableRipple checked={true} />}

          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
