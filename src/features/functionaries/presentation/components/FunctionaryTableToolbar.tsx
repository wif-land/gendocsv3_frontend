import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TableProps } from '../../../../shared/sdk/table'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'
import { SelectChangeEvent } from '@mui/material'
import { IFunctionaryFilters } from '../../domain/entities/IFunctionaryFilters'

export type IFunctionaryTableFilterValue = string | undefined

export type IFunctionaryTableFilters = {
  field: string | undefined
  state: boolean | undefined
}

type Props = {
  filters: IFunctionaryTableFilters
  onFilters: (name: string, value: IFunctionaryTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
  table: TableProps
  setDataTable: (value: FunctionaryModel[]) => void
  getFilteredFunctionaries: (filters: IFunctionaryFilters) => void
}

export const FunctionaryTableToolbar = ({
  filters,
  onFilters,
  setVisitedPages,
  setIsDataFiltered,
  isDataFiltered,
  table,
  setDataTable,
  getFilteredFunctionaries,
}: Props) => {
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue || '')

  const resetValues = () => {
    setVisitedPages([])
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
    setVisitedPages([])

    areFiltersAdded() === true
      ? getFilteredFunctionaries(filters)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [debouncedValue, filters.state])

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
            value={filters.field || ''}
            onChange={handleFilterName}
            placeholder="Busca por nombre"
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
