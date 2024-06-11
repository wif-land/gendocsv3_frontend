import { ICanton, IProvince } from '../../domain/entities/ILocationProvider'

export class CityModel implements ICanton {
  id: number
  name: string
  province: IProvince

  constructor(city: ICanton) {
    this.id = city.id
    this.name = city.name
    this.province = city.province
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: Record<string, any> | string): CityModel {
    if (typeof json === 'string') {
      return JSON.parse(json, CityModel.reviver)
    } else {
      const city = new CityModel({
        id: json.id,
        name: json.name,
        province: json.province,
      })

      return city
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static reviver(key: string, value: any): any {
    return key === '' ? new CityModel(value) : value
  }

  toJson(): ICanton {
    return {
      id: this.id,
      name: this.name,
      province: this.province,
    }
  }
}
