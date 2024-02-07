import Box from '@mui/material/Box'
// import Chip from '@mui/material/Chip'
// import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Stack, { StackProps } from '@mui/material/Stack'
import {
  ICouncilTableFilterValue,
  ICouncilTableFilters,
} from './CouncilTableToolbar'
import Iconify from '../../../../core/iconify'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilTableRow } from './CouncilTableRow'
import { useEffect, useState } from 'react'
// import { CouncilTableRow } from './CouncilTableRow'
// import { useCouncilStore } from '../store/councilsStore'
// import { CouncilModel } from '../../data/models/CouncilModel'

type Props = StackProps & {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  onResetFilters: VoidFunction
  results: number
  councils: CouncilModel[]
  handleDeleteRow: (id: string) => void
  handleEditRow: (id: string) => void
  handleViewRow: (id: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any
}

export const CouncilTableFiltersResult = ({
  // filters,
  // onFilters,
  onResetFilters,
  results,
  councils,
  handleDeleteRow,
  handleEditRow,
  handleViewRow,
  table,
  ...other
  // eslint-disable-next-line arrow-body-style
}: Props) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})

  const toggleActiveState = (id: string) => {
    // Cambia el estado activo actual para el ID dado
    setActiveStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }))
    setSelectedRow(id)
  }

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="stretch"
      >
        {councils &&
          councils.map((item) =>
            item.id?.toString() === selectedRow ? (
              <CouncilTableRow
                key={item.id}
                row={item}
                isOnTable={false}
                activeState={activeStates[item.id!.toString()] || item.isActive}
                selected={true}
                onSelectRow={() => {
                  setSelectedRow(item.id!.toString())
                }}
                onDeleteRow={() => {
                  toggleActiveState(item.id!.toString())
                  handleDeleteRow(item.id!.toString())
                }}
                onEditRow={() => {
                  setSelectedRow(item.id!.toString())
                  handleEditRow(item.id!.toString())
                }}
                onViewRow={() => handleViewRow(item.id!.toString())}
              />
            ) : (
              <CouncilTableRow
                key={item.id}
                row={item}
                isOnTable={false}
                selected={false}
                onSelectRow={() => {
                  setSelectedRow(item.id!.toString())
                }}
                onDeleteRow={() => {
                  toggleActiveState(item.id!.toString())
                  handleDeleteRow(item.id!.toString())
                }}
                onEditRow={() => {
                  setSelectedRow(item.id!.toString())
                  handleEditRow(item.id!.toString())
                }}
                onViewRow={() => handleViewRow(item.id!.toString())}
              />
            ),
          )}
      </Stack>
      <Button
        color="error"
        onClick={onResetFilters}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        Clear
      </Button>
    </Stack>
  )
}
