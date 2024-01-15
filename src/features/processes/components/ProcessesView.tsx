'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  useDisclosure,
  Chip,
  ChipProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react'
import { Key, useEffect, useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { CareerApi } from '../api/careersApi'
import { ICareer } from '../interfaces/ICareer'
import { useCareersStore } from '../../../shared/store/careerStore'
import { CareersForm } from './CareersForm'

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
    key: 'isActive',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

const CareersView = () => {
  const { careers, setCareers } = useCareersStore()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [selectedCareer, setSelectedCareer] = useState<ICareer | null>(null)

  const resolveRowComponentByColumnKey = (item: ICareer, columnKey: Key) => {
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
                {item.isActive ? 'Activado' : 'Desactivado'}
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
                    CareerApi.update(item.id!, {
                      isActive: !item.isActive,
                    })
                      .then((_) =>
                        setCareers(
                          careers!.map((career) => {
                            if (career.id === item.id) {
                              return {
                                ...career,
                                isActive: !item.isActive,
                              }
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
      default:
        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchingCarrers = async () => {
      const result = await CareerApi.getCareers()

      if (result.careers && isMounted) {
        setCareers(result.careers)
      }
    }

    fetchingCarrers()

    return () => {
      isMounted = false
    }
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
        Crear carrera
      </Button>

      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={'No existen datos sobre carerras'}>
            {careers!.map((item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CareersForm
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        values={selectedCareer || undefined}
      />
    </div>
  )
}

export default CareersView
