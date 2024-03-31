'use client'

import React, { useEffect } from 'react'
import useModulesStore from '../../shared/store/modulesStore'
import { fetchModules } from '../../features/modules/api/modules'

export const ModulesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { setModules, modules: currentModules } = useModulesStore()

  useEffect(() => {
    let isMounted = true

    const modulesFetching = async () => {
      try {
        if (currentModules?.length) return

        const modules = await fetchModules()

        if (!modules.modules) return

        if (isMounted) {
          setModules(modules.modules)
        }
      } catch (error) {}
    }
    modulesFetching()
    return () => {
      isMounted = false
    }
  }, [setModules])

  return <>{children}</>
}
