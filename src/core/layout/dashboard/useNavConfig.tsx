import { useEffect } from 'react'
import useModulesStore from '../../../shared/store/modulesStore'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'
import Iconify from '../../iconify'
import { useAuth } from '../../../features/auth/presentation/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface IRoute {
  title: string
  path: string
  icon?: JSX.Element
  children?: IRoute[]
}

interface INavItem {
  subheader: string
  items: IRoute[]
}

const icon = (icon: string) => <Iconify icon={icon} />

const ICONS: {
  [key: string]: JSX.Element
} = {
  consejos: icon('solar:accessibility-bold'),
  documentos: icon('solar:document-bold'),
  actasdegrado: icon('solar:diploma-bold'),
  procesos: icon('mdi:account-arrow-right'),
  estudiantes: icon('solar:user-bold'),
  funcionarios: icon('solar:user-broken'),
  carreras: icon('mdi:format-rotate-90'),
  usuarios: icon('mdi:account-check'),
  cargos: icon('mdi:account-child-circle'),
}

export const useNavConfig = () => {
  const router = useRouter()
  const { user, logout } = useAccountStore()
  const { accessModules, setAccessModules } = useModulesStore()

  useEffect(() => {
    if (user && user.accessModules) {
      setAccessModules(user.accessModules)
      return
    } 

    logout()
    router.replace('/login')
  }, [user])

  const actualModules = accessModules?.map<INavItem>((module) => ({
    subheader: module.name,
    items: module.submodules.map<IRoute>((submodule) => ({
      title: submodule.name,
      path: `/dashboard/${module.code
        .toLowerCase()
        .replaceAll(' ', '_')}/${submodule.name
        .toLowerCase()
        .replaceAll(' ', '_')}`,
      icon: ICONS[submodule.name.toLowerCase().replaceAll(' ', '')],
      children: [
        {
          title: 'Listar',
          path: `/dashboard/${module.code.toLowerCase()}/${submodule.name.toLowerCase()}`,
        },
        {
          title: 'crear',
          path: `/dashboard/${module.code.toLowerCase()}/${submodule.name.toLowerCase()}/new`,
        },
      ],
    })),
  }))

  return actualModules || []
}
