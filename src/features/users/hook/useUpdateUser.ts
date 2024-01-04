import { useFormik } from 'formik'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
import { UsersApi } from '../api/users'
import { toast } from 'react-toastify'
import { useState } from 'react'

interface IUpdateUserForm {
  firstName: '' | undefined
  secondName: '' | undefined
  firstLastName: '' | undefined
  secondLastName: '' | undefined
  outlookEmail: '' | undefined
  roles: [] | undefined
  isActive: false | undefined
  password: '' | undefined
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
})

export const useUpdateUser = () => {
  const [userId, setUserId] = useState('')
  const onSubmit = async (form: IUpdateUserForm) => {
    console.log(form)
    console.log(userId)
    const { status } = await UsersApi.updateUser(userId, form)

    if (status === 200) {
      toast.success('Usuario actualizado con éxito!', { autoClose: 1800 })
    } else {
      toast.error(
        'Error al actualizar el usuario, por favor intenta de nuevo.',
        {
          autoClose: 1800,
        },
      )
      console.log(status)
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
