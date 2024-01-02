import { decode } from 'punycode'
import { Listbox, ListboxItem, Divider } from '@nextui-org/react'
import { ListboxWrapper } from './ListboxWrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useModulesStore from '../store/modulesStore'
import { IModule } from '@/features/modules/types/IModule'
import { UserStore } from '../store/userStore'

const CareerModule = () => {
  const [selectedItem, setSelectedItem] = useState(null)

  const { user } = UserStore()
  const { accessModules, setAccessModules } = useModulesStore()

  // get current path in nextjs 14 using useRouter

  const router = useRouter()
  const path = router.pathname

  useEffect(() => {
    if (user) {
      setAccessModules(user.accessModulesIds)
    }
  }, [user])

  const onHandleClick = (itemKey: any) => {
    setSelectedItem(itemKey)
    if (itemKey === 'new') {
      router.push('/dashboard/council')
    } else if (itemKey === 'copy') {
      router.push('/dashboard/search')
    }
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
                onClick={() => onHandleClick(submodule.name)}
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
