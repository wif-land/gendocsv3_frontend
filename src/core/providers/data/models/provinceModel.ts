import { IProvince } from "../../domain/entities/ILocationProvider";


export class ProvinceModel implements IProvince {
  id: number
  name: string

  constructor(province: IProvince) {
    this.id = province.id
    this.name = province.name
  }

  static fromJson(json: Record<string, any> | string): ProvinceModel {
    if (typeof json === 'string') {
      return JSON.parse(json, ProvinceModel.reviver)
    } else {
      const province = new ProvinceModel({
        id: json.id,
        name: json.name
      })

      return province
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new ProvinceModel(value) : value
  }

  toJson(): IProvince {
    return {
      id: this.id,
      name: this.name
    }
  }
}