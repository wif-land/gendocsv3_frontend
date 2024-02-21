import { useFormik } from 'formik'
import * as yup from 'yup'
import { UsersApi } from '../api/users'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useUsersStore } from '../presentation/state/usersStore'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'

interface IUpdateUserForm {
  firstName: string | undefined
  secondName: string | undefined
  firstLastName: string | undefined
  secondLastName: string | undefined
  outlookEmail: string | undefined
  roles: string[] | undefined
  isActive: boolean | undefined
  password: string | undefined
  accessModules: number[] | undefined
}

const validationSchema = yup.object().shape({
  firstName: yup.string().nullable(),
  secondName: yup.string().nullable(),
  firstLastName: yup.string().nullable(),
  secondLastName: yup.string().nullable(),
  outlookEmail: yup.string().nullable(),
  roles: yup.array().nullable(),
  isActive: yup.boolean().nullable(),
  password: yup.string().nullable(),
  accessModules: yup.array().nullable(),
})

export const useUpdateUser = () => {
  const [userId, setUserId] = useState<number>(0)
  const { load } = useUsersStore()
  const onSubmit = async (form: IUpdateUserForm) => {
    const { status } = await UsersApi.updateUser(userId, form)

    if (status === HTTP_STATUS_CODES.OK) {
      toast.success('Usuario actualizado con éxito!', { autoClose: 1800 })
      load()
    } else {
      toast.error(
        'Error al actualizar el usuario, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
    }
  }

  const formik = useFormik<IUpdateUserForm>({
    initialValues: {
      firstName: undefined,
      secondName: undefined,
      firstLastName: undefined,
      secondLastName: undefined,
      outlookEmail: undefined,
      roles: undefined,
      isActive: undefined,
      password: undefined,
      accessModules: undefined,
    },
    onSubmit,
    validationSchema,
  })

  return { formik, userId, setUserId }
}
