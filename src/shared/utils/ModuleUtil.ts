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

/**
 * Resolve module by code
 * @param modules - List of modules
 * @param codeModule - Module code
 * @returns Module
 * @returns Empty object if module is not found
 * @returns Module object if module is found
 * @returns IModule
 */
export const resolveModuleByCode = (modules: IModule[], codeModule: string) => {
  const module = modules.find(
    (module) => module.code === (codeModule as string).toUpperCase(),
  )

  if (!module) {
    return {} as IModule
  }

  return module
}
