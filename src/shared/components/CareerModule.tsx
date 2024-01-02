import { Listbox, ListboxItem } from '@nextui-org/react'
import { ListboxWrapper } from './ListboxWrapper'
import { useEffect, useState } from 'react'
import useModulesStore from '../store/modulesStore'
import { IModule } from '../../features/modules/types/IModule'
import { UserStore } from '../store/userStore'
import { useRouter } from 'next/navigation'

const CareerModule = () => {
  const [selectedItem, setSelectedItem] = useState('')

  const { user } = UserStore()
  const { accessModules, setAccessModules } = useModulesStore()

  // get current path in nextjs 14 using useRouter
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setAccessModules(user.accessModulesIds)
    }
  }, [user])

  const onHandleClick = (moduleCode: string, submoduleName: string) => {
    const itemKey = `${moduleCode}/${submoduleName}`

    setSelectedItem(itemKey)

    router.push(`/dashboard/${itemKey}`)
  }

  return (
    <>
      {accessModules?.map((module: IModule) => (
        <ListboxWrapper key={module.id}>
          <h1 className="ml-4 mb-2 text-gray-500">{module.name}</h1>
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
