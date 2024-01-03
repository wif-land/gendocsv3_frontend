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
  Switch,
} from '@nextui-org/react'
import { Key, useEffect, useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { CareerApi } from '../api/careersApi'
import { ICareer } from '../interfaces/ICareer'
import * as yup from 'yup'
import { useFormik } from 'formik'

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
    label: 'Activo',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

const CareersView = () => {
  const initialValues = {
    name: '',
    credits: 0,
    menDegree: '',
    womenDegree: '',
    isActive: false,
  }

  const validationSchema = yup.object({
    name: yup.string().required('Campo requerido'),
    credits: yup.string().required('Campo requerido'),
    menDegree: yup.string().required('Campo requerido'),
    womenDegree: yup.string().required('Campo requerido'),
  })

  const onSubmit = (values: ICareer) => {
    handleCreateCareer({
      ...values,
      credits: Number(values.credits),
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const isSubmitting = formik.isSubmitting

  const [careers, setCareers] = useState<ICareer[]>([])
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

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
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await CareerApi.update(item.id!, {
                      isActive: !item.isActive,
                    })
                      .then((_) =>
                        setCareers(
                          careers.map((user) => {
                            if (user.id === item.id) {
                              return {
                                ...user,
                                isActive: !user.isActive,
                              }
                            }

                            return user
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

  const handleCreateCareer = async (values: ICareer) => {
    const result = await CareerApi.create(values)

    if (result.career) {
      setCareers([...careers, result.career])
      toast.success('Carrera creada exitosamente')
      formik.resetForm()
      onClose()
    } else {
      toast.error('Error al crear la carrera', {
        closeButton: false,
      })
    }
  }

  useEffect(() => {
    const fetchingUsers = async () => {
      const result = await CareerApi.getCareers()

      if (result.careers) {
        setCareers(result.careers)
      }
    }

    fetchingUsers()
  }, [])

  return (
    <div>
      <Button onPress={onOpen}>Crear carrera</Button>

      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={careers}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Carrera
              </ModalHeader>

              <form
                onSubmit={async (e) => {
                  formik.handleSubmit(e)
                }}
              >
                <ModalBody>
                  <Input
                    id="name"
                    name="name"
                    type="name"
                    label="Nombre"
                    variant="underlined"
                    placeholder="Eg. Ingeniería en Sistemas"
                    className="w-full"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : ''
                    }
                  />
                  <Input
                    id="credits"
                    name="credits"
                    type="credits"
                    label="Créditos"
                    variant="underlined"
                    placeholder="Eg. 240"
                    className="w-full"
                    value={formik.values.credits.toString()}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.credits && formik.errors.credits
                        ? formik.errors.credits
                        : ''
                    }
                  />
                  <Input
                    id="menDegree"
                    name="menDegree"
                    type="menDegree"
                    label="Título Masculino"
                    variant="underlined"
                    placeholder="Eg. Ingeniero en Sistemas"
                    className="w-full"
                    value={formik.values.menDegree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.menDegree && formik.errors.menDegree
                        ? formik.errors.menDegree
                        : ''
                    }
                  />
                  <Input
                    id="womenDegree"
                    name="womenDegree"
                    type="womenDegree"
                    label="Título Femenino"
                    variant="underlined"
                    placeholder="Eg. Ingeniera en Sistemas"
                    className="w-full"
                    value={formik.values.womenDegree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.womenDegree && formik.errors.womenDegree
                        ? formik.errors.womenDegree
                        : ''
                    }
                  />
                  <Switch
                    defaultSelected
                    aria-label="Automatic updates"
                    onChange={async (e) => {
                      await formik.setFieldValue('isActive', e.target.checked)
                    }}
                    checked={formik.values.isActive}
                    onBlur={formik.handleBlur}
                  >
                    Activo
                  </Switch>
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>

                  <Button color="primary" disabled={isSubmitting} type="submit">
                    Crear
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CareersView
