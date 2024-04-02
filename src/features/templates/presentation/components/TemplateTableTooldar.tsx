import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Iconify from '../../../../core/iconify'

import { SelectChangeEvent } from '@mui/material'
import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'

export type ITemplateTableFilterValue = string | boolean | undefined

export type ITemplateTableFilters = {
  field: string | undefined
  state: boolean | undefined
}

type Props = {
  filters: ITemplateTableFilters
  onFilters: (name: string, value: ITemplateTableFilterValue) => void
  setIsDataFiltered: (value: boolean) => void
}

export const TemplateTableToolbar = ({
  filters,
  onFilters,
  setIsDataFiltered,
}: Props) => {
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilters('field', event.target.value)
    event.target.value !== '' || filters.state !== undefined
      ? setIsDataFiltered(true)
      : setIsDataFiltered(false)
  }

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    onFilters('state', value)
    setIsDataFiltered(true)
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
            value={filters.field || ''}
            onChange={handleFilterName}
            placeholder="Busca por nombre de plantilla"
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
