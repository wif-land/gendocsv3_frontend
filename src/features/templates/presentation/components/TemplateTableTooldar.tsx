import { useEffect, useState } from 'react'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Iconify from '../../../../core/iconify'

import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { TableProps } from '../../../../shared/sdk/table'
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
  setDataTable: (value: TemplateModel[]) => void
  table: TableProps
  getFilteredTemplates: (field: string) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
}

export const TemplateTableToolbar = ({
  filters,
  onFilters,
  setDataTable,
  table,
  setIsDataFiltered,
  getFilteredTemplates,
  isDataFiltered,
}: Props) => {
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue || '')

  const resetValues = () => {
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    !isDataFiltered && setIsDataFiltered(true)
    onFilters('field', event.target.value)
  }

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)

    areFiltersAdded() === true
      ? getFilteredTemplates(debouncedValue)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [debouncedValue])

  const areFiltersAdded = () =>
    (inputValue !== undefined && inputValue !== '') ||
    filters.state !== undefined

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    !isDataFiltered && setIsDataFiltered(true)

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
            value={inputValue}
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
