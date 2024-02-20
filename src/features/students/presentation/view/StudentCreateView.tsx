import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { usePathname } from 'next/navigation'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { StudentNewEditForm } from '../components/StudentNewEditForm'

const StudentCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea un o más estudiantes"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Estudiantes',
            href: pathname.replace('/new', ''),
          },
          { name: 'Agregar estudiante' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StudentNewEditForm />
    </Container>
  )
}

export default memo(StudentCreateView)
