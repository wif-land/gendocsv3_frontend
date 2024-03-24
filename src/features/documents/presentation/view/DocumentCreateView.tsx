import { Container } from '@mui/material'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { DocumentNewEditForm } from '../components/DocumentNewEditForm'

export default memo(() => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear un nuevo consejo"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Consejos',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nuevo consejo' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentNewEditForm />
    </Container>
  )
})
