'use client'

import { fetchModules } from '@/features/modules/api/modules'
import useModulesStore from '@/shared/store/modulesStore'
import React, { useEffect } from 'react'

export const ModulesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { setModules } = useModulesStore()

  useEffect(() => {
    const modulesFetching = async () => {
      try {
        const modules = await fetchModules()
        if (!modules.modules) return console.log('No hay modulos')

        setModules(modules.modules)
      } catch (error) {
        console.log(error)
      }
    }

    modulesFetching()
  }, [setModules])

  return <>{children}</>
}
