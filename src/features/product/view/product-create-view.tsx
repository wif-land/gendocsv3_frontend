'use client'

import Container from '@mui/material/Container'
import ProductNewEditForm from '../product-new-edit-form'
import { useSettingsContext } from '../../../shared/components/settings'
import CustomBreadcrumbs from '../../../shared/components/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../core/routes/paths'

export default function ProductCreateView() {
  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea un nuevo consejo"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Consejos',
            href: paths.dashboard.product.root,
          },
          { name: 'Nuevo consejo' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm />
    </Container>
  )
}
