import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useEffect } from 'react'
import { useCareersStore } from '../../../features/careers/presentation/store/careerStore'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'

interface IStatusFilterProps {
  onChange: (event: SelectChangeEvent) => void
  filters: any
  sx?: any
}

export const CareerFilter = ({ onChange, filters, sx }: IStatusFilterProps) => {
  const { careers, get } = useCareersStore()
  const { user } = useAccountStore()

  useEffect(() => {
    if (careers.length === 0) {
      get()
    }
  }, [])

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
        {careers.map(
          (career) =>
            user?.accessCareersDegCert?.includes(career.id) && (
              <MenuItem key={career.id} value={career.id as number}>
                {' '}
                {career.name}
              </MenuItem>
            ),
        )}
      </Select>
    </FormControl>
  )
}
