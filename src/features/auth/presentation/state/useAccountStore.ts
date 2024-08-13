import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getCookie } from '../../../../shared/utils/CookiesUtil'
import { IUser, IUserPayload } from '../../domain/entities/IUser'
import { ACCESS_TOKEN_COOKIE_NAME } from '../../../../shared/constants/appApiRoutes'
import { jwtDecode } from 'jwt-decode'

interface StoreState {
  user: IUser | undefined
  setUser: (user?: IUser) => void
  retreiveFromCookie: () => Promise<boolean>
  isLogged: boolean
  setIsLogged: (isLogged: boolean) => void
}

const DEFAULT_USER: IUser = {
  id: 0,
  firstLastName: '',
  firstName: '',
  googleEmail: '',
  isActive: false,
  outlookEmail: '',
  secondLastName: '',
  secondName: '',
  sub: 0,
  accessModules: [],
  accessCareersDegCert: [],
}

const STORE_NAME = 'user'

export const useAccountStore = create<StoreState>(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      setUser: (user?: IUser | undefined) => {
        set({ user })
      },
      retreiveFromCookie: async () => {
        const userToken = await getCookie(ACCESS_TOKEN_COOKIE_NAME)

        if (!userToken) return false

        const userData: IUserPayload = jwtDecode(userToken)
        const { sub, ...userWithoutSub } = userData

        set({ user: { ...userWithoutSub, id: sub, sub } })
        return true
      },
      isLogged: false,
      setIsLogged: (isLogged: boolean) => {
        set({ isLogged })
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    },
  ) as StateCreator<StoreState>,
)
