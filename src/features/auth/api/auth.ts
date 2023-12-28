import 'dotenv/config'

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

  const data = await response.json()
  console

  if (response.ok) {
    return { status: 'ok', data }
  }

  return { status: 'error', message: data.message }
}
