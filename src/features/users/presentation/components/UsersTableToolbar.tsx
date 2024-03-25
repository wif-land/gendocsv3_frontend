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
import { IUser } from '../../domain/entities/IUser'
import { StatusFilter } from '../../../../shared/sdk/filters/status-filter'
import { SelectChangeEvent } from '@mui/material'

export type IUsersTableFilterValue = string | string[]

export type IUsersTableFilters = {
  name: string
  personalEmail: string
  outlookEmail: string
  state: string[]
}

type Props = {
  filters: IUsersTableFilters
  onFilters: (name: string, value: IUsersTableFilterValue) => void
  setSearchTerm: (value: string) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  table: TableProps
  setDataTable: (value: IUser[]) => void
  getFilteredUsers: (field: string) => void
}

export const FunctionaryTableToolbar = ({
  filters,
  onFilters,
  setSearchTerm,
  setVisitedPages,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredUsers,
}: Props) => {
  const popover = usePopover()
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)
  const [userState, setUserState] = useState<string[]>([])

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
      getFilteredUsers(debouncedValue)
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

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
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
