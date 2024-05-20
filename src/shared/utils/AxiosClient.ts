/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from './CookiesUtil'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { HTTP_STATUS_CODES } from './app-enums'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/appApiRoutes'
import useLoaderStore from '../store/useLoaderStore'
import { enqueueSnackbar } from 'notistack'
import { LogoutnUseCase } from '../../features/auth/domain/usecases/logoutUseCase'

type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type AxiosErrorResponse = AxiosError<AxiosResponse<Record<string, unknown>>> & {
  response: {
    status: number
    data: {
      message: string
    }
  }
}

interface AxiosResponse<T> {
  message: string
  data: T
}

export class AxiosClient {
  private static client: AxiosInstance
  private static baseUrl? = process.env.NEXT_PUBLIC_API_URL
  private static accessToken: string | null = null

  static getInstance() {
    if (this.client) return this.client

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        ['Content-Type']: 'application/json',
      },
    })

    this.client.interceptors.request.use(
      async (config) => {
        if (!this.accessToken) {
          this.accessToken = await getCookie(ACCESS_TOKEN_COOKIE_NAME)
        }

        if (!this.accessToken) {
          await new LogoutnUseCase().call()
        }

        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken.replaceAll(
            '"',
            '',
          )}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
          new LogoutnUseCase().call()
        }

        return Promise.reject(error)
      },
    )

    return this.client
  }

  /**
   * Set headers in the axios instance
   * @param headers - Headers to set in the axios instance
   */
  static setHeaders(headers: Record<string, string>) {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    }
  }

  /**
   * POST method to make a request to the API
   * @param path - Path to make the request
   * @param body - Body to send in the request
   * @returns Response from the API. You can set the type of the response with the generic type
   */
  static async post<T>(
    path: string,
    body: unknown,
  ): Promise<
    | AxiosResponse<T>
    | {
        error: string
      }
  > {
    try {
      useLoaderStore.getState().addLoaderItem('axios-post')
      const response = await this.getInstance().post(path, body)
      useLoaderStore.getState().removeLoaderItem('axios-post')
      return handleApiResponse(response, 'POST')
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-post')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  static async get<T>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<
    | AxiosResponse<T>
    | {
        error: string
      }
  > {
    try {
      useLoaderStore.getState().addLoaderItem('axios-get')
      const response = await this.getInstance().get(path, options)
      useLoaderStore.getState().removeLoaderItem('axios-get')
      return handleApiResponse(response, 'GET')
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-get')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  /**
   * PUT method to make a request to the API
   * @param path - Path to make the request
   * @param body - Body to send in the request
   * @param params - Query params to send in the request. Optional
   * @returns Response from the API. You can set the type of the response with the generic type
   */
  static async put<T>(
    path: string,
    body: unknown,
    params?: Record<string, unknown>,
  ): Promise<
    | AxiosResponse<T>
    | {
        error: string
      }
  > {
    try {
      useLoaderStore.getState().addLoaderItem('axios-put')
      const response = await this.getInstance().put(path, body, {
        params,
      })
      useLoaderStore.getState().removeLoaderItem('axios-put')

      return handleApiResponse(response, 'PUT')
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-put')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  /**
   * DELETE method to make a request to the API
   * @param path - Path to make the request
   * @param params - Query params to send in the request. Optional
   * @param body - Body to send in the request
   * @returns Response from the API. You can set the type of the response with the generic type
   */
  static async delete<T>({
    path,
    params,
    body,
  }: {
    path: string
    params?: Record<string, unknown>
    body?: any
  }): Promise<
    | AxiosResponse<T>
    | {
        error: string
      }
  > {
    try {
      useLoaderStore.getState().addLoaderItem('axios-delete')
      const response = await this.getInstance().delete(path, {
        params,
        data: body,
      })
      useLoaderStore.getState().removeLoaderItem('axios-delete')

      return handleApiResponse(response, 'DELETE')
    } catch (error) {
      useLoaderStore.getState().removeLoaderItem('axios-delete')
      const response = error as AxiosErrorResponse
      return handleApiError(response)
    }
  }

  /**
   * PATCH method to make a request to the API
   * @param path - Path to make the request
   * @param body - Body to send in the request
   * @param params - Query params to send in the request. Optional
   * @returns Response from the API. You can set the type of the response with the generic type
   */
  static async patch<T>(
    path: string,
    body?: unknown,
    params?: Record<string, unknown>,
  ): Promise<
    | AxiosResponse<T>
    | {
        error: string
      }
  > {
    try {
      const response = await this.getInstance().patch(path, body, {
        params,
      })

      return handleApiResponse(response, 'PATCH')
    } catch (error) {
      const response = error as AxiosErrorResponse

      return handleApiError(response)
    }
  }
}

/**
 * Handle the response from the API
 * @param response - Response from the API
 * @param method - Method used to make the request
 * @returns Response from the API
 */
const handleApiResponse = (response: any, method: HTTP_METHODS) => {
  const { status, data } = response

  if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
    enqueueSnackbar('No estás autorizado para realizar esa acción', {
      variant: 'error',
    })
  }

  if (status === HTTP_STATUS_CODES.BAD_REQUEST) {
    enqueueSnackbar(data.message ?? 'Ocurrió un error, intenta de nuevo', {
      variant: 'error',
    })
  }

  if (status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
    enqueueSnackbar('Ocurrió un error en el servidor', {
      variant: 'error',
    })
  }

  if (method !== 'GET') {
    enqueueSnackbar(data.message, {
      variant: 'success',
    })
  }

  return response.data
}

/**
 * Handle the error from the API
 *
 * Error Response -> If the request was made and the server responded with a status code different than 2xx
 * Error Request -> If the request was made but no response was received from the server
 * Error -> If something happened in setting up the request that triggered an Error
 *
 * @param error - Error from the API response. AxiosErrorResponse
 * @returns Error message
 */
const handleApiError = (
  error: AxiosErrorResponse,
): {
  error: string
} => {
  if (error.response) {
    const {
      data: { message },
    } = error.response as any

    if (message instanceof Array) {
      enqueueSnackbar('Existen errores en el formulario', {
        variant: 'error',
      })
    } else {
      enqueueSnackbar(message || 'Ha ocurrido un error', {
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
    error:
      (error.response?.data as any).message instanceof Array
        ? 'error'
        : (error.response?.data as any).message,
  }
}
