export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const PARAM_TO_REPLACE = ':id'
export const QUERY_PARAM_TO_REPLACE = '?id='

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_ALL: '/functionaries',
    GET_BY_FIELD: (field: string) => `/functionaries/${field}`,
    UPDATE: (id: number) => `/functionaries/${id}`,
    BULK_UPDATE: '/functionaries/bulk',
    DELETE: '/functionaries/:id',
    CREATE: '/functionaries',
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
    GET_BY_FIELD: (field: string) => `/students/search/${field}`,
    UPDATE: (id: number) => `/students/${id}`,
    BULK_UPDATE: '/students/update/bulk',
    DELETE: (id: number) => `/students/${id}`,
    CREATE: '/students',
    CREATE_MANY: '/students/create/bulk',
  },
  FUNCTIONARIES: {
    GET_ALL: '/functionaries',
    GET_BY_FIELD: (field: string) => `/functionaries/${field}`,
    UPDATE: (id: number) => `/functionaries/${id}`,
    BULK_UPDATE: '/functionaries/bulk',
    DELETE: '/functionaries/:id',
    CREATE: '/functionaries',
  },
  PROCESSES: {
    GET_ALL: '/processes',
    GET_ONE: '/processes/:id',
    UPDATE: '/processes/:id',
    DELETE: '/processes/:id',
    CREATE: '/processes',
    GET_BY_MODULE: '/processes/get-by-module?module-code=:moduleCode',
  },
  COUNCILS: {
    GET_ALL: '/councils',
    GET_BY_FIELD: (field: string) => `/councils/${field}`,
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
  },
  DOCUMENTS: {
    GET_ALL: '/documents',
    GET_ONE: '/documents/:id',
    UPDATE: '/documents/:id',
    DELETE: '/documents/:id',
    CREATE: '/documents',
  },
  DOCUMENT_NUMERATION: {
    GET_BY_COUNCIL: '/numeration-document/by-council',
  },
}
