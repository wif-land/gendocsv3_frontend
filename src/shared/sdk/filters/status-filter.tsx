import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'

interface IStatusFilterProps {
  onChange: (event: SelectChangeEvent<string[]>) => void
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
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={filters.state}
        onChange={onChange}
        input={<OutlinedInput label="Estado" />}
        renderValue={(selected) => (
          Array.isArray(selected) ? selected.join(', ') : selected
        )}
        MenuProps={MenuProps}
      >
        {states.map((name) => (
          <MenuItem key={name.label} value={name.label}>
            <Checkbox checked={filters.state.indexOf(name.label) > -1} />
            <ListItemText primary={name.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

