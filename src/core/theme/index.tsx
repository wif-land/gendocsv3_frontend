/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import PropTypes from 'prop-types'
import { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'
import { customShadows } from './custom-shadows'
import { componentsOverrides } from './overrides'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const ThemeProvider = ({ children }: { children: any }) => {
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'), // or palette('dark')
      shadows: shadows('light'), // or shadows('dark')
      customShadows: customShadows('light'), // or customShadows('dark')
      shape: { borderRadius: 8 },
      typography,
    }),
    [],
  )

  const theme = createTheme(memoizedValue as any)

  theme.components = componentsOverrides(theme)

  return (
    <MuiThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ThemeProvider
