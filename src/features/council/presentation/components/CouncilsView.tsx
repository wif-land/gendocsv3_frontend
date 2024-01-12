'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  getKeyValue,
} from '@nextui-org/react'
import { Key, memo, useCallback } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { CouncilsForm } from './CouncilsForm'
import { CouncilType } from '../../domain/entities/ICouncil'
import { DateUtils } from '../../../../shared/utils/dateUtils'
import { COLUMNS, resolveChipData } from './enums'
import { ChipComponent } from '../../../../shared/components/ChipComponent'
import { useCouncilView } from '../hooks/useCouncilView'

const CouncilsView = ({ moduleId }: { moduleId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    councils,
    selectedCareer,
    moduleIdentifier,
    updateCouncils,
    handleSelectedCouncil,
  } = useCouncilView({
    moduleId,
  })

  const resolveRowComponentByColumnKey = (
    item: CouncilModel,
    columnKey: Key,
  ) => {
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
                <DropdownItem
                  key="see-attendees"
                  onPress={() => {
                    onOpen()
                  }}
                >
                  Ver asistentes
                </DropdownItem>

                <DropdownItem
                  key="edit"
                  onPress={() => {
                    handleSelectedCouncil(item)
                    onOpen()
                  }}
                >
                  Editar
                </DropdownItem>

                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={() => {
                    CouncilsUseCasesImpl.getInstance()
                      .update(item.id!, {
                        isActive: !item.isActive,
                      })
                      .then((_) => updateCouncils(item))
                      .catch((error) => {
                        toast.error(error.message)
                      })
                  }}
                >
                  {item.isActive ? 'Desactivar carrera' : 'Activar carrera'}
                </DropdownItem>
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
      <Button
        onPress={handleOpenCreateModal}
        radius="sm"
        className="w-40 h-12 ml-6 border-2  bg-red-600 text-white"
      >
        Crear consejo
      </Button>

      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={'No existen datos sobre consejos'}>
            {councils!.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
