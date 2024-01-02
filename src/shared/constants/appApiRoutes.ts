export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_ALL: '/users',
    GET_ONE: '/users/:id',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  MODULES: {
    GET_ALL: '/modules',
    GET_ONE: '/modules/:id',
    UPDATE: '/modules/:id',
    DELETE: '/modules/:id',
  },
}
