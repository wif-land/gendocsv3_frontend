import { IRoom } from "../../domain/entities/ICertificateProvider";


export class RoomModel implements IRoom {
  id: number
  name: string
  isActive: boolean

  constructor(room: IRoom) {
    this.id = room.id
    this.name = room.name
    this.isActive = room.isActive
  }

  static fromJson(json: Record<string, any> | string): RoomModel {
    if (typeof json === 'string') {
      return JSON.parse(json, RoomModel.reviver)
    } else {
      const room = new RoomModel({
        id: json.id,
        name: json.name,
        isActive: json.isActive,
      })

      return room
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? new RoomModel(value) : value
  }

  toJson(): IRoom {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive
    }
  }
}