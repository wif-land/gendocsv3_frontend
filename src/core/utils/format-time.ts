import { format, getTime, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale/es'

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined

export const fDate = (date: InputValue, newFormat?: string) => {
  const fm = newFormat || 'dd MMM yyyy'

  return date ? format(new Date(date), fm) : ''
}

export const fDateTime = (date: InputValue, newFormat?: string) => {
  const fm = newFormat || 'dd MMM yyyy p'

  return date ? format(new Date(date), fm) : ''
}

export const fTimestamp = (date: InputValue) =>
  date ? getTime(new Date(date)) : ''

export const fToNow = (date: InputValue) =>
  date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es,
      })
    : ''

export const TIME_FORMAT = 'HH:mm'
export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm A'
