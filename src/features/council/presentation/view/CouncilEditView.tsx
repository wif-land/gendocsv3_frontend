'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/components/settings'
import { useParams, usePathname } from 'next/navigation'
import { useCouncilStore } from '../store/councilsStore'
import CustomBreadcrumbs from '../../../../shared/components/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import CouncilNewEditForm from '../components/CouncilNewEditForm'

export default function CouncilEditView() {
  const settings = useSettingsContext()
  const { id } = useParams()
  const pathname = usePathname()
  const { councils } = useCouncilStore()

  const currentProduct = councils.find((council) => council.id! === +id)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Consejos',
            href: pathname.replace('/new', ''),
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CouncilNewEditForm currentCouncil={currentProduct} />
    </Container>
  )
}
