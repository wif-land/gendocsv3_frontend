import { Listbox, ListboxItem } from '@nextui-org/react'
import { ListboxWrapper } from './ListboxWrapper'
import { useEffect } from 'react'
import useModulesStore from '../store/modulesStore'
import { IModule } from '../../features/modules/types/IModule'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'
import { usePathname, useRouter } from 'next/navigation'
import { submoduleIcons, defaultIcon } from '../constants/submodulesIcons'

const CareerModule = () => {
  const { user } = useAccountStore()
  const { accessModules, setAccessModules } = useModulesStore()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let isMounted = true

    if (user && user.accessModules) {
      if (isMounted) {
        setAccessModules(user.accessModules)
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  const onHandleClick = (moduleCode: string, submoduleName: string) => {
    const itemKey = `${moduleCode.toLowerCase()}/${submoduleName.toLowerCase()}`

    router.push(`/dashboard/${itemKey}`)
  }

  return (
    <>
      {accessModules?.map((module: IModule) => (
        <ListboxWrapper key={module.id}>
          <div className="flex">
            <h1 className="mb-2 text-black font-bold rounded-md p-1 bg-opacity-80">
              {module.name}
            </h1>
          </div>

          <Listbox aria-label="Actions" className="ml-6 mr-2 ">
            {module.submodules.map((submodule) => {
              const IconComponent =
                submoduleIcons[submodule.name] || defaultIcon
              return (
                <ListboxItem
                  textValue={submodule.name}
                  key={submodule.name}
                  onClick={() => onHandleClick(module.code, submodule.name)}
                  className={
                    pathname.includes(
                      `${module.code.toLowerCase()}/${submodule.name.toLowerCase()}`,
                    )
                      ? 'text-gray-400'
                      : 'text-black'
                  }
                >
                  <IconComponent className="inline-block mr-2" />
                  {submodule.name}
                </ListboxItem>
              )
            })}
          </Listbox>
        </ListboxWrapper>
      ))}
    </>
  )
}

export default CareerModule
