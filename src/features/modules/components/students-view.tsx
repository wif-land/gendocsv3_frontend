import React, { use, useEffect, useState } from 'react'
import { StudentsApi } from '@/features/students/api/students'
import { useStudent } from '../../students/hooks/useStudent'
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
  Select, SelectItem,
  Switch
} from '@nextui-org/react'
import { IStudent } from '@/features/students/types/IStudent'
import { ICareer } from '@/features/careers/types/ICareer'
import { useRouter } from 'next/navigation'
import { CareersApi } from '@/features/careers/api/carers'
import cantones from '@/features/students/data/canton'


const StudentsView = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const { formik } = useStudent()
  const router = useRouter()
  const rows = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];
  

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
      key: 'googleEmail',
      label: 'Correo Personal',
    },
    {
      key: 'outlookEmail',
      label: 'Correo Institucional',
    },
    {
      key: 'approvedCredits',
      label: 'Creditos Aprobados',
    },
    {
      key: 'registration',
      label: 'Matricula',
    },
    {
      key: 'canton',
      label: 'Ciudad de Residencia',
    },
    {
      key:'gender',
      label:'Genero',
    },
    {
      key: 'actions',
      label: 'Acciones',
    },
  
  ]
  const genders = [
    {
      value: 'M',
      label: 'Masculino'
    },
    {
      value: 'F',
      label: 'Femenino'
    },
  ]
  const [students, setStudents] = useState<IStudent[]>([])
  const [careers, setCareers] = useState<ICareer[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await StudentsApi.fetchStudents()
      if(students.students){
        setStudents(students.students.map((student) => (console.log(student),{
          ...student, name: `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName}`
          })),
        )
      }
    }
    fetchStudents() 
  }, [])

  useEffect(() => {
    const fetchCareers = async () => {
      const careers = await CareersApi.fetchCareers()
      if(careers.careers){
        setCareers(careers.careers.map((career) => ({
          ...career, name: `${career.name}`
          })),
        )
      }
    }
    fetchCareers()
  },[])

  return (
    <div className='m-10'>
      <Button className='w-40 h-12 ml-6 border-2  bg-blue-700   text-white' onPress={onOpen}>Crear Estudiante</Button>
      
      <Table aria-label="Example table with dynamic content" className='m-10'>
      <TableHeader columns={COLUMNS}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={students}>
        {(item) => (
          <TableRow key={item.dni}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
        <ModalContent>
        {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Crear Estudiante</ModalHeader>
              <ModalBody>
              <form
                onSubmit={formik.handleSubmit}
                className="w-full justify-items-center "
              >
                <div className="grid grid-cols-2 gap-4 w-6/6 justify-items-center ">
                  <Input
                    id="dni"
                    name="dni"
                    type="dni"
                    label="DNI"
                    variant="underlined"
                    placeholder="Ingrese un DNI"
                    value={formik.values.dni}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.dni && formik.errors.dni
                        ? formik.errors.dni
                        : ''
                    }
                    className="w-full"
                  />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    label="Primer Nombre"
                    variant="underlined"
                    placeholder="Ingrese un primer nombre"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.firstName && formik.errors.firstName
                        ? formik.errors.firstName
                        : ''
                    }
                    className="w-full"
                  />
                  <Input
                    id="secondName"
                    name="secondName"
                    type="secondName"
                    label="Segundo Nombre"
                    variant="underlined"
                    placeholder="Ingrese un segundo nombre"
                    value={formik.values.secondName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.secondName && formik.errors.secondName
                        ? formik.errors.secondName
                        : ''
                    }
                    className="w-full"
                  />
                  <Input
                    id="firstLastName"
                    name="firstLastName"
                    type="firstLastName"
                    label="Apellido"
                    variant="underlined"
                    placeholder="Ingrese un apellido"
                    value={formik.values.firstLastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.firstLastName && formik.errors.firstLastName
                        ? formik.errors.firstLastName
                        : ''
                    }
                    className="w-full"
                  />
                  <Input
                    id="secondLastName"
                    name="secondLastName"
                    type="secondLastName"
                    label="Segundo Apellido"
                    variant="underlined"
                    placeholder="Ingrese un segundo apellido"
                    value={formik.values.secondLastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.secondLastName && formik.errors.secondLastName
                        ? formik.errors.secondLastName
                        : ''
                    }
                    className="w-full"
                  />
                  <Input
                    id="googleEmail"
                    name="googleEmail"
                    type="googleEmail"
                    label="Correo Personal"
                    variant="underlined"
                    placeholder="Ingrese un email"
                    value={formik.values.googleEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.googleEmail && formik.errors.googleEmail
                        ? formik.errors.googleEmail
                        : ''
                    }
                    className="w-full"/>
                  <Input
                    id="outlookEmail"
                    name="outlookEmail"
                    type="outlookEmail"
                    label="Correo Institucional"
                    variant="underlined"
                    placeholder="Ingrese un email"
                    value={formik.values.outlookEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.outlookEmail&& formik.errors.outlookEmail
                        ? formik.errors.outlookEmail
                        : ''
                    }
                    className="w-full"/>
                  <Input
                    id="regularPhoneNumber"
                    name="regularPhoneNumber"
                    type="phone"
                    label="Telefono Familiar"
                    variant="underlined"
                    placeholder="Ingrese un telefono"
                    value={formik.values.regularPhoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.regularPhoneNumber && formik.errors.regularPhoneNumber
                        ? formik.errors.regularPhoneNumber
                        : ''
                    }
                    className="w-full"/>


                  <Input
                    id="cellphone"
                    name="cellphone"
                    type="phone"
                    label="Telefono Celular"
                    variant="underlined"
                    placeholder="Ingrese un telefono"
                    value={formik.values.cellphone }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.cellphone && formik.errors.cellphone
                        ? formik.errors.cellphone
                        : ''
                    }
                    className="w-full"/>

                  <Input
                    id='registration'
                    name='registration'
                    type='registration'
                    label='Matricula'
                    variant='underlined'
                    placeholder='Ingrese una matricula'
                    value={formik.values.registration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size='lg'
                    errorMessage={
                      formik.touched.registration && formik.errors.registration
                        ? formik.errors.registration
                        : ''
                    }
                    className='w-full'/>
                  
                  <Input
                    id='folio'
                    name='folio'
                    type='folio'
                    label='Folio'
                    variant='underlined'
                    placeholder='Ingrese un folio'
                    value={formik.values.folio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size='lg'
                    errorMessage={
                      formik.touched.folio && formik.errors.folio
                        ? formik.errors.folio
                        : ''
                    }
                    className='w-full'/>

                  <Input
                    id='approvedCredits'
                    name='approvedCredits'
                    type='approvedCredits'
                    label='Creditos Aprobados'
                    variant='underlined'
                    placeholder='Ingrese creditos aprobados'
                    value={formik.values.approvedCredits.toString()}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size='lg'
                    errorMessage={
                      formik.touched.approvedCredits && formik.errors.approvedCredits
                        ? formik.errors.approvedCredits
                        : ''
                    }
                    className='w-full'/>

                  <Select 
                    label="Ciudad de Residencia" 
                    className="w-full" 
                    placeholder="Ciudad de Residencia"
                    variant='underlined'
                  >
                    {cantones.map((canton) => (
                      <SelectItem key={canton.id} value={canton.id}>
                        {canton.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select 
                    label="Genero" 
                    className="w-full" 
                    placeholder="Genero"
                    variant='underlined'
                  >
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select 
                    label="Carrera" 
                    className="w-full" 
                    placeholder="Carrera"
                    variant='underlined'
                  >
                    {careers.map((career) => (
                      <SelectItem key={career.id} value={career.id}>
                        {career.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Switch
                    id="isActive"
                    name="isActive"
                    size="sm"
                    onValueChange={(value) => {
                      const fakeEvent = {
                        target: {
                          name: 'isActive',
                          value,
                        },
                      }
                      formik.handleChange(fakeEvent)
                    }}
                  >
                    Estudiante Activo
                  </Switch>
                </div>
                <div className='m-1 w-full flex gap-4 justify-center'>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-56 m-1 bg-blue-700 text-white"
                    radius='sm'
                    disabled={formik.isSubmitting}
                  >
                    Crear
                  </Button>
                  <Button  type="submit"
                    size="lg"
                    className="w-56 m-1 bg-red-600 text-white"
                    radius='sm'
                    disabled={formik.isSubmitting} 
                    onPress={onClose}>
                    Close
                  </Button>
                </div>
              </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}

export default StudentsView
