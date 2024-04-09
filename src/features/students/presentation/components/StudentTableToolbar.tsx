import { useCallback, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { TableProps } from '../../../../shared/sdk/table'
import { StudentModel } from '../../data/models/StudentModel'
import { useDebounce } from '../../../../shared/hooks/use-debounce'

import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'
import { SelectChangeEvent } from '@mui/material'

export type IStudentTableFilterValue = string | boolean | undefined

export type IStudentTableFilters = {
  field: string | undefined
  state: boolean | undefined
}

type Props = {
  filters: IStudentTableFilters
  onFilters: (name: string, value: IStudentTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
  table: TableProps
  setDataTable: (value: StudentModel[]) => void
  getFilteredStudents: (filters: IStudentTableFilters) => void
}

export const StudentTableToolbar = ({
  filters,
  onFilters,
  setVisitedPages,
  setIsDataFiltered,
  isDataFiltered,
  table,
  setDataTable,
  getFilteredStudents,
}: Props) => {
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue || '')

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
      !isDataFiltered && setIsDataFiltered(true)
      onFilters('field', event.target.value)
    },
    [onFilters],
  )

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    areFiltersAdded() === true ? getFilteredStudents(filters) : resetValues()

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
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
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
