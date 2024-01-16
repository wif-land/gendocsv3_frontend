'use client'

import { useEffect, useReducer, useCallback, useMemo } from 'react'
import { AuthContext } from './auth-context'
import { isValidToken, setSession } from './utils'
import { ActionMapType, AuthStateType, AuthUserType } from '../../types'
import { useUserStore } from '../../../shared/store/userProfileStore'

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType
  }
  [Types.LOGIN]: {
    user: AuthUserType
  }
  [Types.REGISTER]: {
    user: AuthUserType
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
  user: null,
  loading: true,
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    }
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    }
  }
  return state
}

const STORAGE_KEY = 'accessToken'

type Props = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY)

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken)

        const { user } = useUserStore()

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        })
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        })
      }
    } catch (error) {
      console.error(error)
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      })
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  const login = useCallback(async (email: string, password: string) => {
    setSession('')
  }, [])

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {},
    [],
  )

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null)
    dispatch({
      type: Types.LOGOUT,
    })
  }, [])

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'

  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status],
  )

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  )
}
