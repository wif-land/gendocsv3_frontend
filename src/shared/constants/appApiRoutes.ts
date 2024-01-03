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
    DELETE: '/users/:id',
  },
  MODULES: {
    GET_ALL: '/modules',
    GET_ONE: '/modules/:id',
    UPDATE: '/modules/:id',
    DELETE: '/modules/:id',
  },
  STUDENTS: {
    GET_ALL: '/students',
    GET_ONE: '/students/:id',
    UPDATE: '/students/:id',
    DELETE: '/students/:id',
  },
}
