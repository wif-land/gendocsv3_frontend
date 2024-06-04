'use client'

import isEqual from 'lodash/isEqual'
import { useMemo, useCallback, useState } from 'react'
import { SettingsValueProps } from '../types'
import { SettingsContext } from './settings-context'
import { useLocalStorage } from '../../../hooks/use-local-storage'
type SettingsProviderProps = {
  children: React.ReactNode
  defaultSettings: SettingsValueProps
}

export const SettingsProvider = ({
  children,
  defaultSettings,
}: SettingsProviderProps) => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const [settings, setSettings] = useLocalStorage('settings', defaultSettings)

  const onUpdate = useCallback(
    (name: string, value: string | boolean) => {
      setSettings((prevState: SettingsValueProps) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [setSettings],
  )

  const onReset = useCallback(() => {
    setSettings(defaultSettings)
  }, [defaultSettings, setSettings])

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev)
  }, [])

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false)
  }, [])

  const canReset = !isEqual(settings, defaultSettings)

  const memoizedValue = useMemo(
    () => ({
      ...settings,
      onUpdate,
      canReset,
      onReset,
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      onReset,
      onUpdate,
      settings,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ],
  )

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  )
}
