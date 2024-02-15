import { useEffect } from 'react'
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
import { FunctionaryModel } from '../../data/models/FunctionatyModel'

export type IFunctionaryTableFilterValue = string | string[]

export type IFunctionaryTableFilters = {
  name: string
  personalEmail: string
  outlookEmail: string
}

type Props = {
  filters: IFunctionaryTableFilters
  onFilters: (name: string, value: IFunctionaryTableFilterValue) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  setVisitedPages: (value: number[]) => void
  isDataFiltered: boolean
  setIsDataFiltered: (value: boolean) => void
  table: TableProps
  setCount: (value: number) => void
  setDataTable: (value: FunctionaryModel[]) => void
  getFilteredFunctionaries: (field: string, activeRequest: boolean) => void
}

export const FunctionaryTableToolbar = ({
  filters,
  onFilters,
  setSearchTerm,
  searchTerm,
  setVisitedPages,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredFunctionaries,
}: Props) => {
  const popover = usePopover()

  const debounceSetSearchTerm = useDebounce(setSearchTerm)

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      resetValues()
      return
    } else {
      setIsDataFiltered(true)
      debounceSetSearchTerm(event.target.value)
    }
    onFilters('name', event.target.value)
  }

  useEffect(() => {
    table.setPage(0)
    setVisitedPages([])
    let activeRequest = true

    if (searchTerm !== '' && searchTerm.length > 1) {
      getFilteredFunctionaries(searchTerm, activeRequest)
    } else {
      if (searchTerm.length !== 1) resetValues()
    }

    return () => {
      activeRequest = false
    }
  }, [searchTerm])

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
