import { useCallback, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { useDocumentView } from '../hooks/useDocumentsView'
import { useDebounce } from '../../../../shared/hooks/use-debounce'

export type IDocumentTableFilterValue = string | string[]

export type IDocumentTableFilters = {
  createdAt: Date | null
  number: number | null
}

type Props = {
  moduleName: string
}

export const DocumentTableToolbar = ({ moduleName }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue)

  const {
    isDataFiltered,
    table,
    setSearchTerm,
    setVisitedPages,
    filters,
    setTableData,
    handleFilters,
  } = useDocumentView(moduleName)

  const handleFilterDocument = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
      handleFilters('name', event.target.value)
    },
    [handleFilters],
  )

  const resetValues = () => {
    setVisitedPages([])
    setTableData([])
    isDataFiltered.onFalse()
  }

  useEffect(() => {
    table.setPage(0)
    setVisitedPages([])

    if (inputValue) {
      isDataFiltered.onTrue()
      setSearchTerm(inputValue)
      // getFilteredCouncils(debouncedValue)
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
            value={filters.number}
            onChange={handleFilterDocument}
            placeholder="Buscar por número de documento"
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
