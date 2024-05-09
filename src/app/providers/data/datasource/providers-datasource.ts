import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { CertificateStatusModel } from '../models/certificateStatusModel'
import { CertificateTypeModel } from '../models/certificateTypeModel'
import { CityModel } from '../models/cityModel'
import { DegreeModalityModel } from '../models/degreeModalityModel'
import { ProvinceModel } from '../models/provinceModel'
import { RoomModel } from '../models/roomModel'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'

export interface ProvidersDataSource {
  getAllCities(): Promise<CityModel[]>

  getAllProvinces(): Promise<ProvinceModel[]>

  getAllCertificateTypes(): Promise<CertificateTypeModel[]>

  getAllCertificateStatus(): Promise<CertificateStatusModel[]>

  getAllDegreeModalities(): Promise<DegreeModalityModel[]>

  getAllRooms(): Promise<RoomModel[]>
}

export class ProvidersDataSourceImpl implements ProvidersDataSource {
  static instance: ProvidersDataSourceImpl
  static getInstance = (): ProvidersDataSourceImpl => {
    if (!ProvidersDataSourceImpl.instance) {
      ProvidersDataSourceImpl.instance = new ProvidersDataSourceImpl()
    }

    return ProvidersDataSourceImpl.instance
  }

  getAllCities = async () => {
    const result = await AxiosClient.get(
      API_ROUTES.LOCATION_PROVIDER.GET_ALL_CITIES,
    )

    if ('error' in result) {
      return [] as CityModel[]
    }

    return result.data as CityModel[]
  }

  getAllProvinces = async () => {
    const result = await AxiosClient.get(
      API_ROUTES.LOCATION_PROVIDER.GET_ALL_PROVINCES,
    )

    if ('error' in result) {
      return [] as ProvinceModel[]
    }

    return result.data as ProvinceModel[]
  }

  getAllCertificateTypes = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATES_TYPES.GET_ALL)

    if ('error' in result) {
      return [] as CertificateTypeModel[]
    }

    return result.data as CertificateTypeModel[]
  }

  getAllCertificateStatus = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATES_STATUS.GET_ALL)

    if ('error' in result) {
      return [] as CertificateStatusModel[]
    }

    return result.data as CertificateStatusModel[]
  }

  getAllDegreeModalities = async () => {
    const result = await AxiosClient.get(API_ROUTES.DEGREE_MODALITIES.GET_ALL)

    if ('error' in result) {
      return [] as DegreeModalityModel[]
    }

    return result.data as DegreeModalityModel[]
  }

  getAllRooms = async () => {
    const result = await AxiosClient.get(API_ROUTES.ROOMS.GET_ALL)

    if ('error' in result) {
      return [] as RoomModel[]
    }

    return result.data as RoomModel[]
  }
}
