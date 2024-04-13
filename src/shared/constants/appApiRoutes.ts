export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const PARAM_TO_REPLACE = ':id'
export const QUERY_PARAM_TO_REPLACE = '?id='

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_FILTERS: `/users/filter`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: '/users/:id',
    CREATE: '/users',
  },
  MODULES: {
    GET_ALL: '/modules',
    GET_ONE: '/modules/:id',
    UPDATE: '/modules/:id',
    DELETE: '/modules/:id',
  },
  CAREERS: {
    CREATE: '/careers',
    GET_ALL: '/careers',
    GET_ONE: '/careers/:id',
    UPDATE: '/careers',
    DELETE: '/careers/:id',
  },
  STUDENTS: {
    GET_ALL: '/students',
    GET_ONE: '/students/:id',
    GET_BY_FILTERS: `/students/filter`,
    UPDATE: (id: number) => `/students/${id}`,
    BULK_UPDATE: '/students/bulk',
    DELETE: (id: number) => `/students/${id}`,
    CREATE: '/students',
    CREATE_MANY: '/students/bulk',
  },
  FUNCTIONARIES: {
    GET_ALL: '/functionaries',
    GET_BY_FILTERS: `/functionaries/filter`,
    UPDATE: (id: number) => `/functionaries/${id}`,
    BULK_UPDATE: '/functionaries/bulk',
    DELETE: '/functionaries/:id',
    CREATE: '/functionaries',
  },
  PROCESSES: {
    GET_ALL: '/processes',
    GET_ONE: '/processes/:id',
    GET_BY_FILTERS: `/processes/filter`,
    UPDATE: '/processes/:id',
    DELETE: '/processes/:id',
    CREATE: '/processes',
    GET_BY_MODULE: '/processes/get-by-module?module-code=:moduleCode',
  },
  COUNCILS: {
    GET_ALL: '/councils',
    GET_BY_FILTERS: `/councils/filter`,
    GET_COUNT: '/councils/count',
    UPDATE: (id: number) => `/councils/${id}`,
    DELETE: '/councils/:id',
    CREATE: '/councils',
    BULK_UPDATE: '/councils/bulk',
  },
  TEMPLATES: {
    GET_ALL: '/templates',
    GET_ONE: '/templates/:field',
    UPDATE: '/templates/:id',
    DELETE: '/templates/:id',
    CREATE: '/templates',
    GET_BY_PROCESS_ID: (id: number) => `/templates/process/${id}`,
    GET_BY_PROCESS_AND_FIELD: (processId: number, field: string) =>
      `/templates/process/${processId}/${field}`,
  },
  DOCUMENTS: {
    GET_ALL: '/documents',
    GET_ONE: '/documents/:id',
    UPDATE: (id: number) => `/documents/${id}`,
    DELETE: '/documents/:id',
    CREATE: '/documents',
  },
  DOCUMENT_NUMERATION: {
    GET_BY_COUNCIL: '/numeration-document/by-council',
  },
  POSITIONS: {
    GET_ALL: '/positions',
    GET_BY_FIELD: (field: string) => `/positions/filter/${field}`,
    UPDATE: (id: number) => `/positions/${id}`,
    DELETE: (id: number) => `/positions/${id}`,
    DELETE_MANY: '/positions/delete/bulk',
    CREATE: '/positions',
  },
  DEGREE_CERTIFICATES: {
    GET_ALL: '/degree-certificates',
    GET_BY_FILTERS: `/degree-certificates/filter`,
    UPDATE: (id: number) => `/degree-certificates/${id}`,
    DELETE: '/degree-certificates/:id',
    CREATE: '/degree-certificates',
    CREATE_MANY: '/degree-certificates/bulk',
  },
  LOCATION_PROVIDER: {
    GET_ALL_CITIES: '/cities',
    GET_ALL_PROVINCES: '/cities/provinces',
  },
  CERTIFICATE_DEGREES_PROVIDER: {
    GET_ALL_DEGREE_MODALITIES: '/degree-certificates/degree-modalities',
    GET_ALL_CERTIFICATE_TYPES: '/degree-certificates/certificate-types',
    GET_ALL_CERTIFICATE_STATUS: '/degree-certificates/certificate-status',
    GET_ALL_ROOMS: '/degree-certificates/rooms',
  },
}
