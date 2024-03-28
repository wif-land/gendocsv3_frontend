import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
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
import { MobileDatePicker } from '@mui/x-date-pickers'
import {
  DATE_TYPES,
  ICouncilFilters,
} from '../../domain/entities/ICouncilFilters'
import { COUNCIL_TYPES } from '../../domain/entities/ICouncil'
import dayjs, { Dayjs } from 'dayjs'

export type ICouncilTableFilterValue =
  | string
  | Date
  | typeof DATE_TYPES
  | typeof COUNCIL_TYPES
  | undefined

export type ICouncilTableFilters = {
  name: string | undefined
  state: boolean | undefined
  startDate: Date | undefined
  endDate: Date | undefined
  dateType: typeof DATE_TYPES | undefined
  type: typeof COUNCIL_TYPES | undefined
}

type Props = {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  table: TableProps
  setDataTable: (value: CouncilModel[]) => void
  getFilteredCouncils: (filters: ICouncilFilters) => void
}

export const CouncilTableToolbar = ({
  filters,
  onFilters,
  setVisitedPages,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredCouncils,
}: Props) => {
  const popover = usePopover()
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue ? inputValue : '')
  const [areFiltersActive, setAreFiltersActive] = useState(false)

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
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    if (areFiltersAdded()) {
      setIsDataFiltered(true)
      onFilters('name', inputValue)
      getFilteredCouncils(filters as ICouncilFilters)
    } else {
      resetValues()
    }

    return () => {
      isMounted = false
    }
  }, [debouncedValue, filters.state, filters.type])

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    table.setPage(0)
    setVisitedPages([])

    if (areFiltersAdded()) {
      setIsDataFiltered(true)
      onFilters('name', inputValue)
      getFilteredCouncils(filters as ICouncilFilters)
    } else {
      resetValues()
    }

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
            value={filters.name}
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

          <IconButton
            onClick={() => setAreFiltersActive(!areFiltersActive)}
            title="Más filtros"
          >
            <Iconify icon="icon-park-outline:filter" />
          </IconButton>
        </Stack>
      </Stack>

      {areFiltersActive && (
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
              value={filters.type}
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
            <InputLabel id="date-type-label">Tipo de fecha</InputLabel>
            <Select
              labelId="date-type-label"
              id="demo-simple-select"
              label="Tipo de fecha"
              value={filters.dateType}
              input={<OutlinedInput label="Tipo de Fecha" />}
              onChange={(event) => {
                const {
                  target: { value },
                } = event

                onFilters('dateType', value)
              }}
            >
              {DATE_TYPES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: '20%' },
            }}
          >
            <MobileDatePicker
              disabled={!filters.dateType}
              value={dayjs(filters.startDate)}
              format="YYYY-MM-DD"
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
            <MobileDatePicker
              disabled={!filters.dateType || !filters.startDate}
              value={dayjs(filters.endDate)}
              minDate={filters.startDate ? dayjs(filters.startDate) : null}
              format="YYYY-MM-DD"
              onAccept={(e) => {
                onFilters('endDate', (e as unknown as Dayjs).toDate())
              }}
              sx={{ textTransform: 'capitalize' }}
              label="Fecha de fin"
            />
          </FormControl>
        </Stack>
      )}

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
