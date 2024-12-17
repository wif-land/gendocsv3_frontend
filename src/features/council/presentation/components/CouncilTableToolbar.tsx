import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TableProps } from '../../../../shared/sdk/table'
import { CouncilModel } from '../../data/models/CouncilModel'
import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'
import {
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { COUNCIL_TYPES } from '../../domain/entities/ICouncil'
import dayjs, { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../../../core/utils/format-time'

export type ICouncilTableFilterValue =
  | string
  | Date
  | typeof COUNCIL_TYPES
  | undefined

export type ICouncilTableFilters = {
  name: string | undefined
  state: boolean | undefined
  startDate: Date | undefined
  endDate: Date | undefined
  type: typeof COUNCIL_TYPES | undefined
}

type Props = {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
  table: TableProps
  setDataTable: (value: CouncilModel[]) => void
  getFilteredCouncils: (filters: ICouncilFilters) => void
}

export const CouncilTableToolbar = ({
  filters,
  onFilters,
  setVisitedPages,
  setIsDataFiltered,
  isDataFiltered,
  table,
  setDataTable,
  getFilteredCouncils,
}: Props) => {
  const popover = usePopover()
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue ? inputValue : '')

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    !isDataFiltered && setIsDataFiltered(true)
    onFilters('name', event.target.value)
  }

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    areFiltersAdded() === true
      ? getFilteredCouncils(filters as ICouncilFilters)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [debouncedValue, filters.state, filters.type])

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    areFiltersAdded() === true
      ? getFilteredCouncils(filters as ICouncilFilters)
      : resetValues()

    return () => {
      isMounted = false
    }
  }, [filters.endDate, filters.startDate])

  const areFiltersAdded = () =>
    (inputValue !== undefined && inputValue !== '') ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined ||
    filters.state !== undefined ||
    filters.type !== undefined

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
            sx={{
              marginRight: 2,
            }}
            value={filters.name || ''}
            onChange={handleFilterName}
            placeholder="Busca por nombre de consejo"
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
          <InputLabel id="council-type-label">Tipo de Consejo</InputLabel>
          <Select
            labelId="council-type-label"
            id="council-simple-select"
            label="Tipo de Consejo"
            value={filters.type || ''}
            input={<OutlinedInput label="Tipo de Consejo" />}
            onChange={(event) => {
              const {
                target: { value },
              } = event
              onFilters('type', value)
              setIsDataFiltered(true)
            }}
          >
            {COUNCIL_TYPES.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider orientation="vertical" flexItem />

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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose()
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose()
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose()
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  )
}
