import { useCallback } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'
import { SelectChangeEvent } from '@mui/material'

export type ICareerTableFilterValue = string | string[]

export type ICareerTableFilters = {
  name: string | undefined
  state: boolean | undefined
}

type Props = {
  filters: ICareerTableFilters
  onFilters: (name: string, value: ICareerTableFilterValue) => void
  setIsDataFiltered: (value: boolean) => void
}

export const CareerTableToolbar = ({
  filters,
  onFilters,
  setIsDataFiltered,
}: Props) => {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value)
      event.target.value !== '' || filters.state !== undefined
        ? setIsDataFiltered(true)
        : setIsDataFiltered(false)
    },
    [onFilters],
  )

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    setIsDataFiltered(true)

    onFilters('state', value)
  }

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <StatusFilter filters={filters} onChange={handleChange} />

          <TextField
            fullWidth
            value={filters.name || ''}
            onChange={handleFilterName}
            placeholder="Busca por nombre de carrera"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  )
}
