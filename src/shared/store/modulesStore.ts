import { StateCreator, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IModule } from '../../features/modules/types/IModule'

interface StoreState {
  modules: IModule[]
  accessModules: IModule[]
  setModules: (modules: IModule[]) => void
  setAccessModules: (modulesIds: number[]) => void
}

const DEFAULT_MODULES: IModule[] = []
const STORE_NAME = 'modules'
const DEFAULT_ACCESS_MODULES: IModule[] = []

const useModulesStore = create<StoreState>(
  persist(
    (set, get) => ({
      modules: DEFAULT_MODULES,
      setModules: (modules: IModule[]) => set({ modules }),
      accessModules: DEFAULT_ACCESS_MODULES,
      setAccessModules: (modulesIds: number[]) => {
        let actualModules = modulesIds

        const adminModule = modulesIds.find((id) => {
          const module = get().modules.find((module) => module.id === id)
          return module?.code === 'ADMIN'
        })

        const commonModule = modulesIds.find((id) => {
          const module = get().modules.find((module) => module.id === id)
          return module?.code === 'COMM'
        })

        if (commonModule) {
          actualModules = actualModules.filter((id) => id !== commonModule)
          actualModules.unshift(commonModule)
        }

        if (adminModule) {
          actualModules = actualModules.filter((id) => id !== adminModule)
          actualModules.unshift(adminModule)
        }

        const accessModules = actualModules
          .map((id) => {
            const module = get().modules?.find((module) => module.id === id)
            return module
          })
          .filter((module) => module !== undefined) as IModule[]

        set({ accessModules })
      },
    }),
    { name: STORE_NAME, storage: createJSONStorage(() => sessionStorage) },
  ) as StateCreator<StoreState>,
)

export default useModulesStore
