import React from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  useDisclosure,
  Input,
  Chip,
  ChipProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { IStudent } from '@/features/students/types/IStudent'
import { useRouter } from 'next/navigation'

const StudentsView = () => {
  const router = useRouter()
  const COLUMNS = [
    {
      key: 'dni',
      label: 'DNI',
    },
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key:'gender',
      label:'Genero',
    },
    {
      key:'folio',
      label:'Folio',
    },
    {
      key: 'actions',
      label: 'Acciones',
    },
    

  ]

  return (
    <div>
      <Button onClick={()=>{router.push('Estudiantes/add')}}>Create User</Button>
    </div>
  )
}

export default StudentsView
