import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { useParams, usePathname } from 'next/navigation'
import { useFunctionaryView } from '../hooks/useFunctionaryView'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { PositionNewEditForm } from '../components/PositionNewEditForm'
import { usePositionStore } from '../state/usePositionStore'

const FunctionaryEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id } = params

  const { functionaries } = usePositionStore()

  const currentFunctionary = functionaries?.find(
    (functionary) => functionary.id! === +id,
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Funcionarios',
            href: pathname.replace(new RegExp(`/${id}/edit`), ''),
          },
          { name: 'Editar funcionario' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionNewEditForm currentFunctionary={currentFunctionary} />
    </Container>
  )
}

export default memo(FunctionaryEditView)
