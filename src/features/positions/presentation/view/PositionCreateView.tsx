import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { usePathname } from 'next/navigation'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { PositionNewEditForm } from '../components/PositionNewEditForm'

const PositionCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea un nuevo cargo"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Cargos',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nuevo Cargo' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionNewEditForm />
    </Container>
  )
}

export default memo(PositionCreateView)
