export interface INumeration {
  nextAvailableNumber: number
  reservedNumbers: number[]
  enqueuedNumbers: number[]
  usedNumbers: number[]
}
