import { memo } from 'react'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { useParams, usePathname } from 'next/navigation'
import { Container } from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { UsersNewEditForm } from '../components/UsersNewEditForm'
import { useUsersStore } from '../state/usersStore'

const UsersEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id } = params

  const { users } = useUsersStore()

  const currentUser = users?.find((user) => user.id! === +id)

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

      <UsersNewEditForm currentUser={currentUser} />
    </Container>
  )
}

export default memo(UsersEditView)
