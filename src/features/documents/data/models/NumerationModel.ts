/* eslint-disable @typescript-eslint/no-explicit-any */
import { INumeration } from '../../domain/entities/INumeration'

export class NumerationModel implements INumeration {
  nextAvailableNumber: number
  reservedNumbers: number[]
  enqueuedNumbers: number[]
  usedNumbers: number[]

  constructor(props: INumeration) {
    this.nextAvailableNumber = props.nextAvailableNumber
    this.reservedNumbers = props.reservedNumbers
    this.enqueuedNumbers = props.enqueuedNumbers
    this.usedNumbers = props.usedNumbers
  }

  static fromJson(json: Record<string, any> | string): NumerationModel {
    if (typeof json === 'string') {
      return JSON.parse(json, NumerationModel.reviver)
    } else {
      const process = new NumerationModel({
        nextAvailableNumber: json.nextAvailableNumber,
        reservedNumbers: json.reservedNumbers,
        enqueuedNumbers: json.enqueuedNumbers,
        usedNumbers: json.usedNumbers,
      })

      return process
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new NumerationModel(value) : value
  }

  toJson(): INumeration {
    return {
      nextAvailableNumber: this.nextAvailableNumber,
      reservedNumbers: this.reservedNumbers,
      enqueuedNumbers: this.enqueuedNumbers,
      usedNumbers: this.usedNumbers,
    }
  }
}
