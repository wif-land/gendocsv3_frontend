'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Chip,
  ChipProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  getKeyValue,
} from '@nextui-org/react'
import { Key, useEffect, useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useCouncilStore } from '../store/councilsStore'
import { CouncilsForm } from './CouncilsForm'
import useModulesStore from '../../../../shared/store/modulesStore'
import { CouncilType } from '../../domain/entities/ICouncil'

const COLUMNS = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'date',
    label: 'Fecha de ejecución',
  },
  {
    key: 'type',
    label: 'Tipo',
  },
  {
    key: 'isActive',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

const CouncilsView = ({ moduleId }: { moduleId: string }) => {
  const { modules } = useModulesStore()
  const { councils, setCouncils } = useCouncilStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedCareer, setSelectedCareer] = useState<CouncilModel | null>(
    null,
  )

  const resolveChipData = (isActive: boolean, isArchived: boolean) => {
    if (isArchived) {
      return {
        color: 'danger',
        label: 'Archivado',
      }
    }
    if (isActive) {
      return {
        color: 'success',
        label: 'Activado',
      }
    }

    return {
      color: 'warning',
      label: 'Pausado',
    }
  }

  const resolveRowComponentByColumnKey = (
    item: CouncilModel,
    columnKey: Key,
  ) => {
    switch (columnKey) {
      case 'isActive':
        return (
          <TableCell>
            {
              <Chip
                className="capitalize"
                color={
                  resolveChipData(item.isActive, item.isArchived)
                    .color as ChipProps['color']
                }
                size="sm"
                variant="flat"
              >
                {resolveChipData(item.isActive, item.isArchived).label}
              </Chip>
            }
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
                  key="edit"
                  onPress={() => {
                    setSelectedCareer(item)
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
                      .then((_) =>
                        setCouncils(
                          councils!.map((career) => {
                            if (career.id === item.id) {
                              return new CouncilModel({
                                ...career,
                                isActive: !item.isActive,
                              })
                            }

                            return career
                          }),
                        ),
                      )
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
        return (
          <TableCell>
            <Chip
              className="capitalize"
              color={
                item.type === CouncilType.ORDINARY ? 'secondary' : 'primary'
              }
              size="sm"
              variant="flat"
            >
              {item.type === CouncilType.ORDINARY
                ? 'Ordinario'
                : 'Extraordinario'}
            </Chip>
          </TableCell>
        )
      default:
        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    }
  }

  useEffect(() => {
    const fetchingCouncils = async () => {
      const result =
        await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
          modules?.find((module) => module.code === moduleId.toUpperCase())
            ?.id ?? 0,
        )

      if (result.councils) {
        setCouncils(result.councils)
      }
    }

    fetchingCouncils()
  }, [])

  return (
    <div>
      <Button
        onPress={() => {
          setSelectedCareer(null)
          onOpen()
        }}
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
        values={selectedCareer ? selectedCareer : undefined}
      />
    </div>
  )
}

export default CouncilsView
