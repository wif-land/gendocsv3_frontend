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
      if (currentModules?.length) return

      const modules = await fetchModules()

      if (!modules.length) {
        setModules([])
        return
      }

      if (isMounted) {
        setModules(modules)
      }
    }
    modulesFetching()
    return () => {
      isMounted = false
    }
  }, [])

  return <>{children}</>
}
