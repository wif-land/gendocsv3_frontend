import { getCookie } from './CookiesUtil'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { HTTP_STATUS_CODES } from './app-enums'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'
import useLoaderStore from '../store/useLoaderStore'
import { enqueueSnackbar } from 'notistack'

type AxiosErrorResponse = AxiosError<AxiosResponse<Record<string, unknown>>> & {
  response: {
    status: number
    data: {
      message: string
    }
  }
}

interface AxiosResponse<T> {
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
          ['Content-Type']: 'application/json',
        },
      })

      this.client.interceptors.request.use(
        async (config) => {
          const accessToken = await getCookie(ACCESS_TOKEN_COOKIE_NAME)

          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken.replaceAll(
              '"',
              '',
            )}`
          }

          return config
        },
        (error) => Promise.reject(error),
      )
    }

    this.client.interceptors.request.use(
      async (config) => {
        const accessToken = await getCookie(ACCESS_TOKEN_COOKIE_NAME)

        if (accessToken) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken.replaceAll(
              '"',
              '',
            )}`
          }
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    return this.client
  }

  static setHeaders(headers: Record<string, string>) {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    }
  }

  static async post<T>(path: string, body: unknown): Promise<AxiosResponse<T>> {
    try {
      useLoaderStore.getState().addLoaderItem('axios-post')
      const response = await this.getInstance().post(path, body)
      useLoaderStore.getState().removeLoaderItem('axios-post')
      return handleApiResponse(response)
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-post')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  static async get<T>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      useLoaderStore.getState().addLoaderItem('axios-get')
      const response = await this.getInstance().get(path, options)
      useLoaderStore.getState().removeLoaderItem('axios-get')

      return handleApiResponse(response)
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-get')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  static async put<T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    try {
      useLoaderStore.getState().addLoaderItem('axios-put')
      const response = await this.getInstance().put(path, body, {
        params,
      })
      useLoaderStore.getState().removeLoaderItem('axios-put')

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
      useLoaderStore.getState().removeLoaderItem('axios-put')
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

  static async delete<T>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    try {
      useLoaderStore.getState().addLoaderItem('axios-delete')
      const response = await this.getInstance().delete(path, {
        params,
      })
      useLoaderStore.getState().removeLoaderItem('axios-delete')

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
      useLoaderStore.getState().removeLoaderItem('axios-delete')
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

  static async patch<T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.getInstance().patch(path, body, {
        params,
      })

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

const handleApiResponse = <T>(response: AxiosResponse<T>) => {
  const { status, data } = response

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
    enqueueSnackbar('No estás autorizado para realizar esa acción', {
      variant: 'error',
    })
  }

  if (status === HTTP_STATUS_CODES.BAD_REQUEST) {
    enqueueSnackbar(data.message, {
      variant: 'error',
    })
  }

  if (status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
    enqueueSnackbar('Ocurrió un error en el servidor', {
      variant: 'error',
    })
  }

  return {
    status,
    data: {
      message: data.message || 'Error desconocido',
      content: data.content as T,
    },
  }
}

const handleApiError = <T>(error: AxiosErrorResponse) => {
  /**
   * Error response -> If the request was made and the server responded with a status code different than 2xx
   * Error request -> If the request was made but no response was received from the server
   * Error -> If something happened in setting up the request that triggered an Error
   */

  if (error.response) {
    const { status } = error.response

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      enqueueSnackbar('No estás autorizado para realizar esa acción', {
        variant: 'error',
      })
    }

    if (status === HTTP_STATUS_CODES.BAD_REQUEST) {
      enqueueSnackbar(error.response?.data?.message, {
        variant: 'error',
      })
    }

    if (status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      enqueueSnackbar('Ocurrió un error en el servidor', {
        variant: 'error',
      })
    }
  } else if (error.request) {
    enqueueSnackbar('No se ha podido establecer conexión con el servidor', {
      variant: 'error',
    })
  } else {
    enqueueSnackbar('Ocurrió un error en la solicitud', { variant: 'error' })
  }

  return {
    status: error.response?.status,
    data: {
      message: error.response?.data?.message || 'Error desconocido',
      content: null as T,
    },
  }
}
