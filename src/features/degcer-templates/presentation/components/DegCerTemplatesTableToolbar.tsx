import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'

export type IDegreeCertificateTableFilterValue = string

export type IDegCerTemplateTableFilters = {
  name: string
}

type Props = {
  filters: IDegCerTemplateTableFilters
  onFilters: (name: string, value: IDegreeCertificateTableFilterValue) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
}

export const DegCerTemplatesTableToolbar = ({
  filters,
  onFilters,
  isDataFiltered,
  setIsDataFiltered,
}: Props) => {
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    !isDataFiltered && setIsDataFiltered(true)
    onFilters('name', event.target.value)
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
          pr: { xs: 2.5, md: 2.5 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Busca por nombre de acta"
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
