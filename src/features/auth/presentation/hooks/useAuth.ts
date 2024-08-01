import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useAccountStore } from '../state/useAccountStore'
import { LoginUseCase } from '../../domain/usecases/loginUseCase'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { VALIDATION_MESSAGES } from '../../../../shared/utils/FormUtil'
import { LogoutUseCase } from '../../domain/usecases/logoutUseCase'

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
    await new LogoutUseCase().call()
    setUser(undefined)
  }

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AuthSchema),
    defaultValues,
  })

  const { reset, watch } = methods
  const values = watch()

  const onSubmit = async (data: FormValuesProps) => {
    const { decoded } = await new LoginUseCase().call({
      email: data.email,
      password: data.password,
    })

    decoded && setUser(decoded)
    router.push('/dashboard')
    reset()
  }

  return { handleLogout, methods, values, onSubmit }
}
