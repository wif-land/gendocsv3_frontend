import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { TableProps } from '../../../../shared/sdk/table'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { CareerFilter } from '../../../../shared/sdk/filters/career-filter'
import { FormControl, SelectChangeEvent } from '@mui/material'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../../../core/utils/format-time'

export type IDegreeCertificateTableFilterValue =
  | string
  | Date
  | undefined
  | boolean

export type IDegreeCertificateTableFilters = {
  careerId?: number
  field?: string
  startDate?: Date | undefined
  endDate?: Date | undefined
  isReport?: boolean
  isEnd?: boolean
}

type Props = {
  filters: IDegreeCertificateTableFilters
  onFilters: (name: string, value: IDegreeCertificateTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
  table: TableProps
  setDataTable: (value: DegreeCertificateModel[]) => void
  getFilteredDegreCertificates: (field: IDegreeCertificateFilters) => void
}

export const DegreeCertificatesTableToolbar = ({
  filters,
  onFilters,
  isDataFiltered,
  setIsDataFiltered,
  setDataTable,
  setVisitedPages,
  table,
  getFilteredDegreCertificates,
}: Props) => {
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue ? inputValue : '')

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    !isDataFiltered && setIsDataFiltered(true)
    onFilters('field', event.target.value)
  }

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    areFiltersAdded() === true
      ? getFilteredDegreCertificates(filters as IDegreeCertificateFilters)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [debouncedValue, filters.careerId])

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    areFiltersAdded() === true
      ? getFilteredDegreCertificates(filters as IDegreeCertificateFilters)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [filters.endDate, filters.startDate])

  const areFiltersAdded = () =>
    (inputValue !== undefined && inputValue !== '') ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined ||
    filters.careerId !== undefined

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    !isDataFiltered && setIsDataFiltered(true)

    onFilters('careerId', value)
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
          sx={{ width: 1, display: 'flex', flexDirection: 'row' }}
        >
          <CareerFilter
            onChange={handleChange}
            filters={filters}
            sx={{ width: 700 }}
          />
          <TextField
            fullWidth
            value={filters.field}
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
            sx={{ flexGrow: 1 }}
          />
          {/* {filters.isReport === true && filters.isEnd === true && (
            <IconButton
              onClick={() => setAreFiltersActive(!areFiltersActive)}
              title="Más filtros"
            >
              <Iconify icon="icon-park-outline:filter" />
            </IconButton>
          )} */}
        </Stack>
      </Stack>
      {filters.isReport === true && (
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
                e && onFilters('startDate', (e as unknown as Dayjs).toDate())
                if (!filters.endDate) {
                  e && onFilters('endDate', (e as unknown as Dayjs).toDate())
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
              minDate={filters.startDate ? dayjs(filters.startDate) : null}
              format={DATE_FORMAT}
              onAccept={(e) => {
                onFilters('endDate', (e as unknown as Dayjs).toDate())
              }}
              sx={{ textTransform: 'capitalize' }}
              label="Fecha de fin"
            />
          </FormControl>
        </Stack>
      )}
    </>
  )
}
