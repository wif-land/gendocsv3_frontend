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
import { Key, useEffect, useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { useDocumentStore } from '../store/documentsStore'
import { DocumentsForm } from './DocumentsForm'
import useModulesStore from '../../../../shared/store/modulesStore'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { useRouter } from 'next/navigation'

// const statusColorMap: Record<string, ChipProps['color']> = {
//   active: 'success',
//   paused: 'danger',
// }
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
  {
    key: 'view',
    label: 'Ver',
  },
]
const DocumentsView = ({ moduleId }: { moduleId: string }) => {
  const router = useRouter()
  const [processUpdate, setProcessUpdate] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { modules } = useModulesStore()
  const { documents, setDocuments } = useDocumentStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProcess, setSelectedProcess] = useState<DocumentModel | null>(
    null,
  )
  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  const resolveRowComponentByColumnKey = (
    item: DocumentModel,
    columnKey: Key,
  ) => {
    switch (columnKey) {
      // case 'isActive':
      //   return (
      //     <TableCell>
      //       {
      //         <Chip
      //           className="capitalize"
      //           color={statusColorMap[item.isActive ? 'active' : 'paused']}
      //           size="sm"
      //           variant="flat"
      //         >
      //           {item.isActive ? 'Si' : 'No'}
      //         </Chip>
      //       }
      //     </TableCell>
      //   )
      case 'view':
        return (
          <TableCell>
            <Button
              variant="light"
              onClick={() => {
                setSelectedProcess(item)
                router.push(`${moduleId}/view/${item.id}`)
              }}
            >
              Ver
            </Button>
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
        await DocumentsUseCasesImpl.getInstance().getAllProcessesByModuleId(
          moduleIdentifier,
        )

      if (result.processes) {
        setDocuments(result.processes)
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
        Crear documento
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
            {documents!.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DocumentsForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        values={
          selectedProcess
            ? selectedProcess
            : DocumentModel.fromJson({
                moduleId: moduleIdentifier,
              })
        }
      />
    </div>
  )
}

export default DocumentsView
