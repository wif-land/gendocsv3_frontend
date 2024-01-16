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
    GET_ONE: '/users/:id',
    UPDATE: '/users',
    DELETE: '/users',
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
    UPDATE: '/students/:id',
    DELETE: '/students/:id',
    CREATE: '/students',
  },
  FUNCTIONARIES: {
    GET_ALL: '/functionaries',
    GET_ONE: '/functionaries/:id',
    UPDATE: '/functionaries',
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
    GET_ONE: '/councils/:id',
    UPDATE: '/councils/:id',
    DELETE: '/councils/:id',
    CREATE: '/councils',
  },
  TEMPLATES: {
    GET_ALL: '/templates',
    GET_ONE: '/templates/:id',
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
}
