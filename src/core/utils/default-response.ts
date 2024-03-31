export interface DefaultResponse<T extends number | string | object> {
  success: boolean
  data?: {
    [key: string]: T | T[] | number | string
  }
  error?: string
}