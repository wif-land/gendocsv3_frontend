import { AxiosClient } from "@/shared/utils/AxiosClient"
import { CertificateStatusModel } from "../models/certificateStatusModel"
import { CertificateTypeModel } from "../models/certificateTypeModel"
import { CityModel } from "../models/cityModel"
import { DegreeModalityModel } from "../models/degreeModalityModel"
import { ProvinceModel } from "../models/provinceModel"
import { RoomModel } from "../models/roomModel"
import { API_ROUTES } from "@/shared/constants/appApiRoutes"
import { HTTP_STATUS_CODES } from "@/shared/utils/app-enums"

export interface ProvidersDataSource {
  getAllCities(): Promise<{
    status: number
    cities: CityModel[]
  }>

  getAllProvinces(): Promise<{
    status: number
    provinces: ProvinceModel[]
  }>

  getAllCertificateTypes(): Promise<{
    status: number
    certificateTypes: CertificateTypeModel[]
  }>

  getAllCertificateStatus(): Promise<{
    status: number
    certificateStatus: CertificateStatusModel[]
  }>

  getAllDegreeModalities(): Promise<{
    status: number
    degreeModalities: DegreeModalityModel[]
  }>

  getAllRooms(): Promise<{
    status: number
    rooms: RoomModel[]
  }>

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
    const result = await AxiosClient.get(API_ROUTES.LOCATION_PROVIDER.GET_ALL_CITIES)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        cities: [] as CityModel[],
      }
    }

    const { status, data } = result

    return { status, cities: data.content as CityModel[] }
  }

  getAllProvinces = async () => {
    const result = await AxiosClient.get(API_ROUTES.LOCATION_PROVIDER.GET_ALL_PROVINCES)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        provinces: [] as ProvinceModel[],
      }
    }

    const { status, data } = result

    return { status, provinces: data.content as ProvinceModel[] }
  }

  getAllCertificateTypes = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATE_DEGREES_PROVIDER.GET_ALL_CERTIFICATE_TYPES)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        certificateTypes: [] as CertificateTypeModel[],
      }
    }

    const { status, data } = result

    return { status, certificateTypes: data.content as CertificateTypeModel[] }
  }

  getAllCertificateStatus = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATE_DEGREES_PROVIDER.GET_ALL_CERTIFICATE_STATUS)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        certificateStatus: [] as CertificateStatusModel[],
      }
    }

    const { status, data } = result

    return { status, certificateStatus: data.content as CertificateStatusModel[] }
  }

  getAllDegreeModalities = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATE_DEGREES_PROVIDER.GET_ALL_DEGREE_MODALITIES)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        degreeModalities: [] as DegreeModalityModel[],
      }
    }

    const { status, data } = result

    return { status, degreeModalities: data.content as DegreeModalityModel[] }
  }

  getAllRooms = async () => {
    const result = await AxiosClient.get(API_ROUTES.CERTIFICATE_DEGREES_PROVIDER.GET_ALL_ROOMS)

    if ('error' in result) {
      return {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        rooms: [] as RoomModel[],
      }
    }

    const { status, data } = result

    return { status, rooms: data.content as RoomModel[] }
  }

}
