import { useEffect, useState } from 'react'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Iconify from '../../../../core/iconify'
import { TableProps } from '../../../../shared/sdk/table'
import { ProcessModel } from '../../data/models/ProcessesModel'
import { useDebounce } from '../../../../shared/hooks/use-debounce'

export type IProcessTableFilterValue = string | string[]

export type IProcessTableFilters = {
  name: string
}

type Props = {
  filters: IProcessTableFilters
  onFilters: (name: string, value: IProcessTableFilterValue) => void
  setSearchTerm: (value: string) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  table: TableProps
  setDataTable: (value: ProcessModel[]) => void
  getFilteredProcesss: (field: string) => void
}

export const ProcessTableToolbar = ({
  filters,
  onFilters,
  setSearchTerm,
  setVisitedPages,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredProcesss,
}: Props) => {
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onFilters('name', event.target.value)
  }

  useEffect(() => {
    table.setPage(0)
    setVisitedPages([])

    if (inputValue) {
      setIsDataFiltered(true)
      setSearchTerm(inputValue)
      getFilteredProcesss(debouncedValue)
    } else {
      resetValues()
    }
  }, [debouncedValue])

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
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Busca por nombre de proceso"
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
