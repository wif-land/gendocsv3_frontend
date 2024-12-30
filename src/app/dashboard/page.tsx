'use client'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'

import SeoIllustration from '../../shared/assets/illustrations/seo-illustration'
import AppWelcome from './app-welcome'
import { useSettingsContext } from '../../shared/sdk/settings'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'

export default () => {
  const settings = useSettingsContext()
  const { user } = useAccountStore()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Hola 👋, ${user?.firstName} ${user?.firstLastName}`}
            description="Bienvenido a tu panel de control, aquí podrás gestionar los documentos"
            img={<SeoIllustration />}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
