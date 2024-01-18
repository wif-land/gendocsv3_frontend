'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/components/settings'
import CustomBreadcrumbs from '../../../../shared/components/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { usePathname } from 'next/navigation'
import CouncilNewEditForm from '../components/council-new-edit-form'

export default function ProductCreateView() {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product"
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

      <CouncilNewEditForm />
    </Container>
  )
}
