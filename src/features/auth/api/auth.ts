import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { IAccountUser } from '../types/IUserAccount'

export const login = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    },
  )

  // eslint-disable-next-line no-magic-numbers
  if (response.status === 401) {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  const data = await response.json()
  const decoded: IAccountUser = jwtDecode(data.accessToken)

  if (response.ok) {
    return { status: 'ok', decoded }
  }

  return { status: 'error', message: data.message }
}
