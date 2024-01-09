import { Listbox, ListboxItem } from '@nextui-org/react'
import { ListboxWrapper } from './ListboxWrapper'
import { useEffect, useState } from 'react'
import useModulesStore from '../store/modulesStore'
import { IModule } from '../../features/modules/types/IModule'
import { useUserStore } from '../store/userProfileStore'
import { useRouter } from 'next/navigation'
import { AiOutlineRight } from "react-icons/ai";
import {submoduleIcons , IconType, defaultIcon } from '../../shared/constants/submodulesIcons'
import { Icon } from 'next/dist/lib/metadata/types/metadata-types'

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
  interface ISubmoduleIcons {
    [key: string]: IconType;
  }
  

  return (
    <>
      {accessModules?.map((module: IModule) => (
        <ListboxWrapper key={module.id}>
          <div className='flex'>
            <h1 className="mb-2 text-black font-bold rounded-md p-1 bg-opacity-80">
              {module.name}
            </h1>
          </div>
          
          <Listbox aria-label="Actions" className="ml-6 mr-2 ">
            {module.submodules.map((submodule) => {
              

              const IconComponent = submoduleIcons[submodule.name] || defaultIcon;
              return(
                <ListboxItem
                  key={submodule.name}
                  onClick={() => onHandleClick(module.code, submodule.name)}
                  className={
                    selectedItem === submodule.name
                      ? 'text-gray-400'
                      : 'text-black'
                  }
                >
                  <IconComponent className="inline-block mr-2" />
                  {submodule.name}
                </ListboxItem>)
              
          })}
          </Listbox>
        </ListboxWrapper>
      ))}
    </>
  )
}

export default CareerModule
