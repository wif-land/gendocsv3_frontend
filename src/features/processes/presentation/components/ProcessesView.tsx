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
import { useProcessStore } from '../store/processesStore'
import { ProcessesForm } from './ProcessesForm'
import useModulesStore from '../../../../shared/store/modulesStore'
import { ProcessModel } from '../../data/models/ProcessesModel'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'
import { toast } from 'react-toastify'

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
}
const COLUMNS = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'moduleId',
    label: 'Modulo',
  },
  {
    key: 'userId',
    label: 'Usuario',
  },
  {
    key: 'isActive',
    label: 'Activo',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]
const ProcessesView = ({ moduleId }: { moduleId: string }) => {
  const [processUpdate, setProcessUpdate] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { modules } = useModulesStore()
  const { processes, setProcesses } = useProcessStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProcess, setSelectedProcess] = useState<ProcessModel | null>(
    null,
  )
  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  const resolveRowComponentByColumnKey = (
    item: ProcessModel,
    columnKey: Key,
  ) => {
    switch (columnKey) {
      case 'isActive':
        return (
          <TableCell>
            {
              <Chip
                className="capitalize"
                color={statusColorMap[item.isActive ? 'active' : 'paused']}
                size="sm"
                variant="flat"
              >
                {item.isActive ? 'Si' : 'No'}
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
                    setSelectedProcess(item)
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
                    ProcessesUseCasesImpl.getInstance()
                      .update(item.id!, {
                        isActive: !item.isActive,
                      })
                      .then((_) => {
                        setProcesses(
                          processes!.map((process) => {
                            if (process.id === item.id) {
                              return new ProcessModel({
                                ...process,
                                isActive: !item.isActive,
                              })
                            }
                            return process
                          }),
                        )
                        // Establece el estado para actualizar la lista de procesos
                        setProcessUpdate(true)
                      })
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
      default:
        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchingProcesses = async () => {
      if (!isMounted) return
      setIsFetching(true)
      const result =
        await ProcessesUseCasesImpl.getInstance().getAllProcessesByModuleId(
          moduleIdentifier,
        )

      if (result.processes) {
        setProcesses(result.processes)
        setIsFetching(false)
      }
    }

    fetchingProcesses()

    setProcessUpdate(false)

    return () => {
      isMounted = false
    }
  }, [moduleId, processUpdate])

  return (
    <div>
      <Button
        onPress={() => {
          setSelectedProcess(null)
          onOpen()
        }}
        radius="sm"
        className="w-40 h-12 ml-6 border-2  bg-red-600 text-white"
      >
        Crear proceso
      </Button>

      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={'No existen datos sobre procesos'}
            isLoading={isFetching}
          >
            {processes!.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProcessesForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        values={
          selectedProcess
            ? selectedProcess
            : ProcessModel.fromJson({
                moduleId: moduleIdentifier,
              })
        }
      />
    </div>
  )
}

export default ProcessesView
