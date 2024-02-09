import { VALIDATION_MESSAGES } from '../../../../shared/utils/Messages'
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

interface FormValuesProps {
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { setUser, logout: userStoreLogout } = useAccountStore()

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

  const logout = async () => {
    const TIME_TO_SLEEP = 250

    new Promise((resolve) => setTimeout(resolve, TIME_TO_SLEEP))
      .then(() => {
        userStoreLogout()
        enqueueSnackbar('Hasta pronto!')
      })
      .then(() => {
        new Promise((resolve) => setTimeout(resolve, TIME_TO_SLEEP)).then(() =>
          router.push(appPublicRoutes.login),
        )
      })
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
          enqueueSnackbar(
            'Error al iniciar sesión, por favor verifica tus credenciales.',
            { variant: 'error' },
          )
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

  return { logout, methods, values, onSubmit }
}
