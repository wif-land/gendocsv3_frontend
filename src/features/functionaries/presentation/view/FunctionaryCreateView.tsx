import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { usePathname } from 'next/navigation'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { FunctionaryNewEditForm } from '../components/FunctionaryNewEditForm'

const FunctionaryCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea un nuevo funcionario"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Funcionarios',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nuevo funcionario' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FunctionaryNewEditForm />
    </Container>
  )
}

export default memo(FunctionaryCreateView)
