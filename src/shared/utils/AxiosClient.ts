import { getCookie } from './CookiesUtil'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { HTTP_STATUS_CODES } from './app-enums'

interface MyResponseData {
  message: string
  [key: string]: unknown
}

export class AxiosClient {
  private static client: AxiosInstance
  private static baseUrl? = process.env.NEXT_PUBLIC_API_URL

  static getInstance() {
    if (!this.client) {
      this.client = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`,
          ['Content-Type']: 'application/json',
        },
      })
    }

    return this.client
  }

  static async post(path: string, body: unknown): Promise<unknown> {
    try {
      const response = await this.getInstance().post(path, body)

      const { data, status } = response

      if (status === HTTP_STATUS_CODES.CREATED) {
        return {
          status,
          data: {
            message: 'Success',
            content: data,
          },
        }
      }
    } catch (error) {
      const response = error as AxiosError<
        AxiosResponse<Record<string, unknown>>
      >

      return {
        status: response.response?.status,
        data: {
          message: response.response?.data.message || 'Error desconocido',
        },
      }
    }
  }

  static async get(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
        ['Content-Type']: 'application/json',
      },
    })

    const data = await response.json()
    console.log(data)

    if (response.ok) {
      return { status: 'ok', data }
    }

    return { status: 'error', message: data.message }
  }
}
