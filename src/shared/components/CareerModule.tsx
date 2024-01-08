import { Listbox, ListboxItem } from '@nextui-org/react'
import { ListboxWrapper } from './ListboxWrapper'
import { useEffect, useState } from 'react'
import useModulesStore from '../store/modulesStore'
import { IModule } from '../../features/modules/types/IModule'
import { useUserStore } from '../store/userProfileStore'
import { useRouter } from 'next/navigation'

const CareerModule = () => {
  const { user } = useUserStore()
  const { accessModules, setAccessModules } = useModulesStore()
  const [selectedItem, setSelectedItem] = useState('')

  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const handleSetUserModules = () => {
      if (user && user.accessModules) {
        if (isMounted) {
          setAccessModules(user.accessModules)
        }
      }
    }
    handleSetUserModules()
    return () => {
      isMounted = false
    }
  }, [])

  const onHandleClick = (moduleCode: string, submoduleName: string) => {
    const itemKey = `${moduleCode.toLowerCase()}/${submoduleName.toLowerCase()}`

    setSelectedItem(itemKey)

    router.push(`/dashboard/${itemKey}`)
  }

  return (
    <>
      {accessModules?.map((module: IModule) => (
        <ListboxWrapper key={module.id}>
          <h1 className="ml-4 mb-2 text-gray-500 bg-slate-200 rounded-md p-1 bg-opacity-80">
            {module.name}
          </h1>
          <Listbox aria-label="Actions" className="ml-6 mr-2 ">
            {module.submodules.map((submodule) => (
              <ListboxItem
                key={submodule.name}
                onClick={() => onHandleClick(module.code, submodule.name)}
                className={
                  selectedItem === submodule.name
                    ? 'text-gray-400'
                    : 'text-black'
                }
              >
                {submodule.name}
              </ListboxItem>
            ))}
          </Listbox>
        </ListboxWrapper>
      ))}
    </>
  )
}

export default CareerModule
