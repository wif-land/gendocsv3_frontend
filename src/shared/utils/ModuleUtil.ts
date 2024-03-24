import { IModule } from '../../features/modules/types/IModule'

export const resolveModuleId = (modules: IModule[], codeModule: string) => {
  const module = modules.find(
    (module) => module.code === (codeModule as string).toUpperCase(),
  )

  if (!module) {
    return 0
  }

  return module.id
}
