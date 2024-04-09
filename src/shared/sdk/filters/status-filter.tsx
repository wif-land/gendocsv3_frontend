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
        label="Estado del Consejo"
        value={filters.state !== undefined ? filters.state : ''}
        input={<OutlinedInput label="Estado" />}
        onChange={onChange}
      >
        {states.map((state) => (
          <MenuItem key={state.label} value={state.value as unknown as string}>{state.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
