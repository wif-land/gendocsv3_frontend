import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'
import { useCareerData } from '@/core/providers/career-provider'

interface IStatusFilterProps {
  onChange: (event: SelectChangeEvent) => void
  filters: any
  sx?: any
}

export const CareerFilter = ({ onChange, filters, sx }: IStatusFilterProps) => {
  const { careers } = useCareerData()
  const { user } = useAccountStore()

  return (
    <FormControl sx={{ m: 1, ...sx }}>
      <InputLabel id="demo-multiple-checkbox-label">Carrera</InputLabel>
      <Select
        labelId="council-type-label"
        id="council-simple-select"
        label="Carrera"
        value={filters.careerId ? filters.careerId : ''}
        input={<OutlinedInput label="Estado" />}
        onChange={onChange}
      >
        {careers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (career) =>
              user?.accessCareersDegCert?.includes(career.id) && (
                <MenuItem key={career.id} value={career.id as number}>
                  {career.name}
                </MenuItem>
              ),
          )}
      </Select>
    </FormControl>
  )
}
