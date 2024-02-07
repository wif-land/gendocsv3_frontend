import { useCallback } from 'react'
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

export type ICouncilTableFilterValue = string | string[]

export type ICouncilTableFilters = {
  name: string
}

type Props = {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  setFilteredCouncils: (councils: CouncilModel[]) => void
  moduleId: number
}

export const CouncilTableToolbar = ({
  filters,
  onFilters,
  setFilteredCouncils: setFilterdCouncils,
  moduleId,
}: Props) => {
  const popover = usePopover()

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const getFilteredCouncils = async () => {
        const response = await CouncilsUseCasesImpl.getInstance().getByTerm(
          event.target.value,
          moduleId,
        )
        setFilterdCouncils(response.council)
      }

      getFilteredCouncils()
      onFilters('name', event.target.value)
    },
    [onFilters],
  )

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
            defaultValue={filters.name}
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
