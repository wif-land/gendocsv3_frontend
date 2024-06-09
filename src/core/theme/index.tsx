'use client'

import merge from 'lodash/merge'
import { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
} from '@mui/material/styles'
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'
import { customShadows } from './custom-shadows'
import { componentsOverrides } from './overrides'
import { presets } from './options/presets'
import { darkMode } from './options/dark-mode'
import { contrast } from './options/contrast'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useSettingsContext } from '../../shared/sdk/settings'
import esLocale from 'dayjs/locale/es'
import dayjs from 'dayjs'
import { esES } from '@mui/x-date-pickers/locales'

dayjs.locale(esLocale)

type Props = {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext()

  const darkModeOption = darkMode(settings.themeMode)

  const presetsOption = presets(settings.themeColorPresets)

  const contrastOption = contrast(
    settings.themeContrast === 'bold',
    settings.themeMode,
  )

  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      typography,
      shape: { borderRadius: 8 },
    }),

    [],
  )

  const memoizedValue = useMemo(
    () =>
      merge(
        // Base
        baseOption,
        // Dark mode: remove if not in use
        darkModeOption,
        // Presets: remove if not in use
        presetsOption,
        // Contrast: remove if not in use
        contrastOption.theme,
      ),
    [baseOption, darkModeOption, presetsOption, contrastOption.theme],
  )

  const theme = createTheme(memoizedValue as ThemeOptions, esES)

  theme.components = merge(
    componentsOverrides(theme),
    contrastOption.components,
  )

  return (
    <MuiThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        localeText={
          esES.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  )
}
