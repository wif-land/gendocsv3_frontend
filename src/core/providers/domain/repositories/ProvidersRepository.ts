import { CertificateStatusModel } from '../../data/models/certificateStatusModel'
import { CertificateTypeModel } from '../../data/models/certificateTypeModel'
import { CityModel } from '../../data/models/cityModel'
import { DegreeModalityModel } from '../../data/models/degreeModalityModel'
import { DegreeModel } from '../../data/models/degreeModel'
import { ProvinceModel } from '../../data/models/provinceModel'
import { RoomModel } from '../../data/models/roomModel'

export interface ProvidersRepository {
  getAllCities(): Promise<CityModel[]>

  getAllProvinces(): Promise<ProvinceModel[]>

  getAllCertificateTypes(): Promise<CertificateTypeModel[]>

  getAllCertificateStatus(): Promise<CertificateStatusModel[]>

  getAllDegreeModalities(): Promise<DegreeModalityModel[]>

  getAllRooms(): Promise<RoomModel[]>

  getAllDegrees(): Promise<DegreeModel[]>
}
