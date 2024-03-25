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

export type ICouncilTableFilterValue = string | string[] | Date | null | number

export type ICouncilTableFilters = {
  name: string
  state: string[]
  startDate: Date | null
  endDate: Date | null
  dateType: number | null
  councilType: number | null
}

type Props = {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  setSearchTerm: (value: string) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  table: TableProps
  setDataTable: (value: CouncilModel[]) => void
  getFilteredCouncils: (field: string) => void
}

export const CouncilTableToolbar = ({
  filters,
  onFilters,
  setSearchTerm,
  setVisitedPages,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredCouncils,
}: Props) => {
  const popover = usePopover()
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const [userState, setUserState] = useState<string[]>([])
  const [areFiltersActive, setAreFiltersActive] = useState(false)
  const [isDateTypeSelected, setDateTypeSelected] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

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
      getFilteredCouncils(debouncedValue)
    } else {
      resetValues()
    }
  }, [debouncedValue])

  const handleChange = (event: SelectChangeEvent<typeof userState>) => {
    const {
      target: { value },
    } = event
    setIsDataFiltered(true)

    if (value.length === 0) {
      resetValues()
      onFilters('state', [])
      return
    }

    console.log(handleState(value as string[]))
    console.log(debouncedValue)

    setUserState(typeof value === 'string' ? value.split(',') : value)
    onFilters('state', value)
  }

  const handleState = (values: string[]) =>
    values.map((value) => value === 'Activo')

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
              value={filters.councilType}
              input={<OutlinedInput label="Tipo de Consejo" />}
              onChange={(event) => {
                const {
                  target: { value },
                } = event
                onFilters('councilType', value as unknown as number)
                setIsDataFiltered(true)
              }}
            >
              <MenuItem value={1}>Ordinario </MenuItem>
              <MenuItem value={2}>Extraordinario</MenuItem>
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
                setDateTypeSelected(true)
                const {
                  target: { value },
                } = event
                onFilters('dateType', value as unknown as number)
              }}
            >
              <MenuItem value={1}>Fecha de creación </MenuItem>
              <MenuItem value={2}>Fecha de Ejecución</MenuItem>
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
              value={filters.startDate}
              onAccept={(e) => {
                setStartDate(e)
                onFilters('startDate', e)
                if (!filters.endDate) {
                  setEndDate(e)
                  onFilters('endDate', e)
                }
                setIsDataFiltered(true)
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
              value={filters.endDate}
              minDate={startDate}
              onAccept={(e) => {
                setEndDate(e)
                onFilters('endDate', e as Date)
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
