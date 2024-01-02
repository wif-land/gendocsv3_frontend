import { getCookie } from './CookiesUtil'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { HTTP_STATUS_CODES } from './app-enums'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'

type AxiosErrorResponse = AxiosError<AxiosResponse<Record<string, unknown>>> & {
  response: {
    status: number
    data: {
      message: string
    }
  }
}

interface AxiosClientResponse<T> {
  status: number
  data: {
    message: string
    content: T
  }
}

export class AxiosClient {
  private static client: AxiosInstance
  private static baseUrl? = process.env.NEXT_PUBLIC_API_URL

  static getInstance() {
    if (!this.client) {
      this.client = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${getCookie(ACCESS_TOKEN_COOKIE_NAME)}`,
          ['Content-Type']: 'application/json',
        },
      })
    }

    return this.client
  }

  static async post<T>(
    path: string,
    body: unknown,
  ): Promise<AxiosClientResponse<T>> {
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

      return {
        status,
        data: {
          message: 'Error desconocido',
          content: null as T,
        },
      }
    } catch (error) {
      const response = error as AxiosErrorResponse

      return {
        status: response.response?.status,
        data: {
          message: response.response?.data?.message || 'Error desconocido',
          content: null as T,
        },
      }
    }
  }

  static async get<T>(path: string): Promise<AxiosClientResponse<T>> {
    try {
      const response = await this.getInstance().get(path)

      const { data, status } = response

      if (status === HTTP_STATUS_CODES.OK) {
        return {
          status,
          data: {
            message: 'Success',
            content: data as T,
          },
        }
      }

      return {
        status,
        data: {
          message: 'Error desconocido',
          content: null as T,
        },
      }
    } catch (error) {
      const response = error as AxiosErrorResponse

      return {
        status: response.response?.status,
        data: {
          message: response.response?.data?.message || 'Error desconocido',
          content: null as T,
        },
      }
    }
  }
}
