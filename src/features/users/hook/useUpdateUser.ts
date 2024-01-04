import { useFormik } from 'formik'
import { VALIDATION_MESSAGES } from '../../../shared/utils/Messages'
import * as yup from 'yup'
import { UsersApi } from '../api/users'
import { toast } from 'react-toastify'
import { useState } from 'react'

interface IUpdateUserForm {
  firstName: ''
  secondName: ''
  firstLastName: ''
  secondLastName: ''
  outlookEmail: ''
  roles: []
  isActive: false
  password: ''
  accessModules: number[]
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
    }
  }

  const formik = useFormik<IUpdateUserForm>({
    initialValues: {
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      outlookEmail: '',
      roles: [],
      isActive: false,
      password: '',
      accessModules: [],
    },
    onSubmit,
    validationSchema,
  })

  return { formik, userId, setUserId }
}
