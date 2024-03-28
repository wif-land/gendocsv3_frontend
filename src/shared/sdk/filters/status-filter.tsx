import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'

interface IStatusFilterProps {
  onChange: (event: SelectChangeEvent) => void
  filters: any
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
}

const states = [
  {
    label: 'Activo',
    value: true,
  },
  {
    label: 'Inactivo',
    value: false,
  },
]

export const StatusFilter = ({ onChange, filters }: IStatusFilterProps) => {
  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-checkbox-label">Estado</InputLabel>
      <Select
        labelId="council-type-label"
        id="council-simple-select"
        label="Tipo de Consejo"
        value={filters.councilType}
        input={<OutlinedInput label="Tipo de Consejo" />}
        onChange={onChange}
      >
        {states.map((state) => (
          <MenuItem key={state.label} value={state.value as unknown as string}>{state.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
