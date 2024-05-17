import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useAccountStore } from '../state/useAccountStore'
import { enqueueSnackbar } from 'notistack'
import { LoginUseCase } from '../../domain/usecases/loginUseCase'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'
import { LogoutnUseCase } from '../../domain/usecases/logoutUseCase'

interface FormValuesProps {
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { setUser } = useAccountStore()

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
    await new LogoutnUseCase().call()
    setUser(undefined)
    router.push('/login')
    enqueueSnackbar('Hasta pronto!')
  }

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AuthSchema),
    defaultValues,
  })

  const { reset, watch } = methods
  const values = watch()

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      const { decoded } = await new LoginUseCase().call({
        email: data.email,
        password: data.password,
      })

      decoded && setUser(decoded)

      enqueueSnackbar(`Bienvenido de vuelta ${decoded!.firstName}!`)
      router.push('/dashboard')
      reset()
    },
    [enqueueSnackbar, reset, router],
  )

  return { handleLogout, methods, values, onSubmit }
}
