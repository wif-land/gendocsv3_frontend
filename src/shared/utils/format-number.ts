import numeral from 'numeral'

export const PERCENT_DIVIDER = 100

type InputValue = string | number | null

export const fNumber = (number: InputValue) => numeral(number).format()

export const fCurrency = (number: InputValue) => {
  const format = number ? numeral(number).format('$0,0.00') : ''

  return result(format, '.00')
}

export const fPercent = (number: InputValue) => {
  const format = number
    ? numeral(Number(number) / PERCENT_DIVIDER).format('0.0%')
    : ''

  return result(format, '.0')
}

export const fShortenNumber = (number: InputValue) => {
  const format = number ? numeral(number).format('0.00a') : ''

  return result(format, '.00')
}

export const fData = (number: InputValue) => {
  const format = number ? numeral(number).format('0.0 b') : ''

  return result(format, '.0')
}

const result = (format: string, key = '.00') => {
  const isInteger = format.includes(key)

  return isInteger ? format.replace(key, '') : format
}
