import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { useParams, usePathname } from 'next/navigation'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { StudentNewEditForm } from '../components/StudentNewEditForm'
import { useStudentView } from '../hooks/useStudentView'

const StudentEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id } = params

  const { students } = useStudentView()

  const currentStudent = students?.find(
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
            name: 'Estudiantes',
            href: pathname.replace(new RegExp(`/${id}/edit`), ''),
          },
          { name: 'Editar estudiante' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StudentNewEditForm currentStudent={currentStudent} />
    </Container>
  )
}

export default memo(StudentEditView)
