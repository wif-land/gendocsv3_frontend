'use client'

import React, { useEffect } from 'react'
import useModulesStore from '../../shared/store/modulesStore'
import { fetchModules } from '../../features/modules/api/modules'

export const ModulesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { setModules } = useModulesStore()

  useEffect(() => {
    let isMounted = true
    const modulesFetching = async () => {
      try {
        const modules = await fetchModules()
        if (!modules.modules) return console.log('No hay modulos')
        if (isMounted) {
          setModules(modules.modules)
        }
      } catch (error) {
        console.log(error)
      }
    }
    modulesFetching()
    return () => {
      isMounted = false
    }
  }, [setModules])

  return <>{children}</>
}
