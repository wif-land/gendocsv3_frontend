import { useEffect } from 'react'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilStore } from '../store/councilsStore'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

export type ICouncilTableFilterValue = string | string[]

export type ICouncilTableFilters = {
  name: string
}

type Props = {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  setFilteredCouncils: (councils: CouncilModel[]) => void
  moduleId: number
  setDataTable: (data: CouncilModel[]) => void
  setIsDataFiltered: (isDataFiltered: boolean) => void
  setCount: (count: number) => void
  setVisitedPages: (visitedPages: number[]) => void
  currentPage: number
  rowsPerPage: number
  setCurrentPage: (currentPage: number) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
}

export const CouncilTableToolbar = ({
  // filters,
  onFilters,
  setFilteredCouncils,
  moduleId,
  setIsDataFiltered,
  setDataTable,
  setVisitedPages,
  currentPage,
  rowsPerPage,
  setCount,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
}: Props) => {
  const popover = usePopover()

  const { setCouncils } = useCouncilStore()

  const debouncedSetSearchTerm = useDebounce(setSearchTerm)

  const handleFilterNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value === '') {
      setIsDataFiltered(false)
      setVisitedPages([])
    } else {
      setIsDataFiltered(true)
    }

    debouncedSetSearchTerm(event.target.value)
  }

  useEffect(() => {
    setCurrentPage(0)
    let activeRequest = true
    const getFilteredCouncils = async () => {
      const { data, status } =
        await CouncilsUseCasesImpl.getInstance().getByTerm(
          searchTerm,
          moduleId,
          rowsPerPage,
          currentPage * rowsPerPage,
        )

      if (status === HTTP_STATUS_CODES.NOT_FOUND) {
        setDataTable([])
        setCouncils([])
        setFilteredCouncils([])
        setCount(0)
        return
      }

      if (activeRequest) {
        setCount(data.count)
        setCouncils(data.councils)
        setFilteredCouncils(data.councils)
        setDataTable(data.councils)
        onFilters('name', searchTerm)
      }
    }

    if (searchTerm === '') {
      setDataTable([])
      setIsDataFiltered(false)
      setVisitedPages([])
    } else {
      getFilteredCouncils()
    }

    return () => {
      activeRequest = false
      setVisitedPages([])
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
            defaultValue={searchTerm}
            onChange={handleFilterNameChange}
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
