import { IModule } from '../../features/modules/types/IModule'

/**
 * Resolve module id from modules list
 * @param modules - List of modules
 * @param codeModule - Module code
 * @returns Module id
 */
export const resolveModuleId = (modules: IModule[], codeModule: string) => {
  const module = modules.find(
    (module) => module.code === (codeModule as string).toUpperCase(),
  )

  if (!module) {
    return 0
  }

  return module.id
}
