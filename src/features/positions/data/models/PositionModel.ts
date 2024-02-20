/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFunctionary } from '../../../../features/functionaries/domain/entities/IFunctionary'
import { IPosition } from '../../domain/entities/IPosition'

export class PositionModel implements IPosition {
  id?: number
  variable: string
  name: string
  functionary: IFunctionary

  constructor(props: IPosition) {
    this.id = props.id
    this.variable = props.variable
    this.name = props.name
    this.functionary = props.functionary
  }

  static fromJson(json: Record<string, any>): PositionModel {
    return new PositionModel({
      id: json.id,
      variable: json.variable,
      name: json.name,
      functionary: json.functionary,
    })
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      variable: this.variable,
      name: this.name,
      functionary: this.functionary,
    }
  }
}
