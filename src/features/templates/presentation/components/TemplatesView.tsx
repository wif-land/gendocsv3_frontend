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
import { useProcessStore } from '../../../processes/presentation/store/processesStore'
import { TemplatesForm } from './TemplatesForm'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { toast } from 'react-toastify'
import { ProcessModel } from '../../../../features/processes/data/models/ProcessesModel'

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
    key: 'hasStudent',
    label: 'Tiene estudiante',
  },
  {
    key: 'hasFunctionary',
    label: 'Tiene funcionario',
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
const ProcessesView = ({ processId }: { processId: string }) => {
  const [isFetching, setIsFetching] = useState(false)
  const { processes } = useProcessStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [templates, setTemplates] = useState<TemplateModel[]>([])
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateModel | null>(null)

  const resolveRowComponentByColumnKey = (
    item: TemplateModel,
    columnKey: Key,
  ) => {
    switch (columnKey) {
      case 'isActive':
      case 'hasStudent':
      case 'hasFunctionary':
        return (
          <TableCell>
            {
              <Chip
                className="capitalize"
                color={statusColorMap[item[columnKey] ? 'active' : 'paused']}
                size="sm"
                variant="flat"
              >
                {item[columnKey] ? 'Si' : 'No'}
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
                    setSelectedTemplate(item)
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
                    setIsFetching(true) // Opcional: para mostrar animación de carga si tiene una
                    TemplatesUseCasesImpl.getInstance()
                      .update(item.id!, {
                        isActive: !item.isActive,
                      })
                      .then((_) => {
                        useProcessStore
                          .getState()
                          .updateTemplate(+processId, item.id as number, {
                            isActive: !item.isActive,
                          })
                        toast.success('Plantilla actualizada exitosamente')
                      })
                      .catch((error) => {
                        toast.error(error.message)
                      })
                      .finally(() => {
                        setIsFetching(false)
                      })
                  }}
                >
                  {item.isActive ? 'Desactivar plantilla' : 'Activar plantilla'}
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
    const process: ProcessModel | undefined = processes.find(
      (p) => p.id === +processId,
    )
    if (process) {
      setTemplates(process.templateProcesses as TemplateModel[])
    }
  }, [processes, processId])

  return (
    <div>
      <Button
        onPress={() => {
          setSelectedTemplate(null)
          onOpen()
        }}
        radius="sm"
        className="w-40 h-12 ml-6 border-2  bg-red-600 text-white"
      >
        Agregar plantilla
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
            {templates!.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TemplatesForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        values={
          selectedTemplate
            ? selectedTemplate
            : TemplateModel.fromJson({
                processId: +processId,
              })
        }
      />
    </div>
  )
}

export default ProcessesView
