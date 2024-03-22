import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useAccountStore } from '../state/useAccountStore'
import { appPublicRoutes } from '../../../../shared/constants/appPublicRoutes'
import { enqueueSnackbar } from 'notistack'
import { LoginUseCase } from '../../domain/usecases/loginUseCase'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'

interface FormValuesProps {
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { setUser, logout } = useAccountStore()

  const AuthSchema = Yup.object().shape({
    email: Yup.string()
      .email(VALIDATION_MESSAGES.invalidFormat)
      .required(VALIDATION_MESSAGES.required)
      .matches(
        /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
        'El correo debe terminar con @uta.edu.ec',
      ),
    password: Yup.string().required(VALIDATION_MESSAGES.required),
  })

  const defaultValues = {
    email: '',
    password: '',
  }

  const handleLogout = async () => {
    logout()
    enqueueSnackbar('Hasta pronto!')
    router.push(appPublicRoutes.login)
  }

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AuthSchema),
    defaultValues,
  })

  const { reset, watch } = methods
  const values = watch()

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const { status, decoded } = await new LoginUseCase().call({
          email: data.email,
          password: data.password,
        })

        if (status === HTTP_STATUS_CODES.CREATED) {
          decoded && setUser(decoded)

          enqueueSnackbar(`Bienvenido de vuelta ${decoded!.firstName}!`)

          router.push('/dashboard')
        } else {
          throw new Error('Error al iniciar sesión')
        }
        reset()
      } catch (error) {
        enqueueSnackbar(
          'Error al iniciar sesión, por favor verifica tus credenciales.',
          { variant: 'error' },
        )
      }
    },
    [enqueueSnackbar, reset, router],
  )

  return { handleLogout, methods, values, onSubmit }
}
