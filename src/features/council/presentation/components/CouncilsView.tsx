'use client'

import { Key, memo, useCallback } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilType } from '../../domain/entities/ICouncil'
import { DateUtils } from '../../../../shared/utils/dateUtils'
import { COLUMNS, resolveChipData } from './enums'
import { ChipComponent } from '../../../../shared/components/ChipComponent'
import { useCouncilView } from '../hooks/useCouncilView'
import { ButtonComponent } from '../../../../shared/components/Button'
import { FormActionsProps } from '../../../../shared/constants/common'
import { CouncilsForm } from './CouncilsForm'
import { useCouncilsForm } from '../hooks/useCouncilsForm'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { useDisclosure } from '@nextui-org/react'

const createData = (
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) => ({ name, calories, fat, carbs, protein })

const CouncilsView = ({ moduleId }: { moduleId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    loader,
    councils,
    selectedCareer,
    moduleIdentifier,
    handleSelectedCouncil,
  } = useCouncilView({
    moduleId,
  })
  const { handleUpdateCouncil } = useCouncilsForm(
    CouncilModel.fromJson({}),
    onOpenChange,
  )

  const resolveRowComponentByColumnKey = (
    item: CouncilModel,
    columnKey: Key,
  ) => {
    const ACTIONS_DATA: FormActionsProps[] = [
      {
        label: 'Ver asistentes',
        key: 'see-attendees',
        onClick: () => {
          onOpen()
        },
      },
      {
        label: 'Editar',
        key: 'edit',
        onClick: () => {
          handleSelectedCouncil(item)
          onOpen()
        },
      },
      {
        label: item.isActive ? 'Desactivar carrera' : 'Activar carrera',
        key: item.isActive ? 'desactivate' : 'activate',
        className: item.isActive ? 'text-danger' : 'text-success',
        color: item.isActive ? 'danger' : 'success',
        onClick: async () => {
          await handleUpdateCouncil(item.id!, {
            isActive: !item.isActive,
          })
        },
      },
    ]

    switch (columnKey) {
      case 'isActive':
        const chipData = resolveChipData(item.isActive, item.isArchived)
        return (
          <TableCell>
            <ChipComponent {...chipData} />
          </TableCell>
        )

      case 'actions':
        return (
          <TableCell>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">
                  <MdMoreVert size={25} />
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                {ACTIONS_DATA.map((action) => (
                  <DropdownItem
                    key={action.key}
                    className={action.className}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </TableCell>
        )

      case 'type':
        const color =
          item.type === CouncilType.ORDINARY ? 'secondary' : 'primary'
        const label =
          item.type === CouncilType.ORDINARY ? 'Ordinario' : 'Extraordinario'

        return (
          <TableCell>
            <ChipComponent color={color} label={label} />
          </TableCell>
        )

      case 'date':
        return (
          <TableCell>{DateUtils.parseStringDateToISO(item.date)}</TableCell>
        )
      default:
        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    }
  }

  const handleOpenCreateModal = useCallback(() => {
    handleSelectedCouncil(null)
    onOpen()
  }, [])

  return (
    <div key={moduleId}>
      <ButtonComponent label="Crear consejo" onClick={handleOpenCreateModal} />

      <div className="m-6">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {councils.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  title="Click para ver asistentes"
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {row.createdAt?.toString() || new Date().toISOString()}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    {row.isActive ? 'Activo' : 'Desactivado'}
                  </TableCell>
                  <TableCell>
                    {row.isActive ? 'Activo' : 'Desactivado'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          count={councils.length}
          page={0}
          onPageChange={() => {
            console.log('onPageChange')
          }}
          onRowsPerPageChange={() => {
            console.log('onRowsPerPageChange')
          }}
          rowsPerPage={5}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          sx={{
            borderTopColor: 'transparent',
          }}
        />
      </Box>

      {/* <div className="m-6">
        {!loader.length && (
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={COLUMNS}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              emptyContent={'No existen datos sobre consejos'}
              items={councils}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) =>
                    resolveRowComponentByColumnKey(item, columnKey)
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div> */}

      <CouncilsForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        values={
          selectedCareer
            ? selectedCareer
            : CouncilModel.fromJson({
                moduleId: moduleIdentifier,
              })
        }
      />
    </div>
  )
}

export default memo(CouncilsView)
