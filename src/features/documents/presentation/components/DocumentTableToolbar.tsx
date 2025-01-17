import { useCallback, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { useDocumentView } from '../hooks/useDocumentsView'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { defaultFilters } from '../constants/constants'
import { FormControl } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '@/core/utils/format-time'

export type IDocumentTableFilterValue = string | string[] | Date

export interface IDocumentFilters {
  moduleId?: number
  field?: string
  startDate?: Date
  endDate?: Date
  order?: 'ASC' | 'DESC'
}

export const DocumentTableToolbar = ({
  moduleCode,
}: {
  moduleCode: string
}) => {
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue)

  const {
    table,
    setVisitedPages,
    filters,
    moduleIdentifier,
    setFilters,
    setTableData,
    handleFilters,
    getFilteredDocuments,
    setIsDataFiltered,
  } = useDocumentView(moduleCode)

  const handleFilterDocument = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
      handleFilters('field', event.target.value)
    },
    [handleFilters],
  )

  const resetValues = () => {
    setFilters(defaultFilters(moduleIdentifier))
    setVisitedPages([])
    setTableData([])
    setIsDataFiltered(false)
  }

  useEffect(() => {
    table.setPage(0)
    setVisitedPages([])

    if (inputValue) {
      setIsDataFiltered(true)
      getFilteredDocuments(filters)
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
          sx={{ width: 1, pr: 2 }}
        >
          <TextField
            fullWidth
            value={filters.field}
            onChange={handleFilterDocument}
            placeholder="Buscar por número de documento, estudiante, docente, plantilla, consejo"
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
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pt: 0,
          pr: { xs: 2.5, md: 2 },
          ml: 1.2,
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: '20%' },
          }}
        >
          <DatePicker
            value={dayjs(filters.startDate) || null}
            format={DATE_FORMAT}
            onAccept={(e) => {
              e && handleFilters('startDate', (e as unknown as Dayjs).toDate())
              if (!filters.endDate) {
                e && handleFilters('endDate', (e as unknown as Dayjs).toDate())
              }
            }}
            sx={{ textTransform: 'capitalize' }}
            label="Fecha de inicio"
          />
        </FormControl>
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: '20%' },
          }}
        >
          <DatePicker
            disabled={!filters.startDate}
            value={dayjs(filters.endDate) || null}
            disableFuture
            minDate={filters.startDate ? dayjs(filters.startDate) : null}
            format={DATE_FORMAT}
            onAccept={(e) => {
              handleFilters('endDate', (e as unknown as Dayjs).toDate())
            }}
            sx={{ textTransform: 'capitalize' }}
            label="Fecha de fin"
          />
        </FormControl>
      </Stack>
    </>
  )
}
