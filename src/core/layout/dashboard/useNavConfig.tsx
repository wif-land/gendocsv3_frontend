import { useEffect } from 'react'
import useModulesStore from '../../../shared/store/modulesStore'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'
import Iconify from '../../iconify'
import { useAuth } from '../../../features/auth/presentation/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { fetchModules } from '../../../features/modules/api/modules'

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
  const { user, logout, retreiveFromCookie } = useAccountStore()
  const { accessModules, setAccessModules } = useModulesStore()
  const { modules, setModules } = useModulesStore()

  useEffect(() => {
    if (modules.length === 0) {
      fetchModules().then(data => {
        setModules(data.modules || [])
      })
      
      return
    }

    if (user && user.id === 0) {
      retreiveFromCookie().then((isLogged) => {
        if (!isLogged) {
          logout()
        }
      })
      return
    }

    if (user && user.accessModules) {
      setAccessModules(user.accessModules)
      return
    }
  }, [user, modules])

  const actualModules = accessModules?.map<INavItem>((module) => ({
    subheader: module.name,
    items: module.submodules.map<IRoute>((submodule) => {
      const mainPath = `/dashboard/${module.code
        .toLowerCase()
        .replaceAll(' ', '_')}/${submodule.name
        .toLowerCase()
        .replaceAll(' ', '_')}`
      const listPath = `${mainPath}`
      const createPath = `${mainPath}/new`

      return {
        title: submodule.name,
        path: mainPath,
        icon: ICONS[submodule.name.toLowerCase().replaceAll(' ', '')],
        children: [
          {
            title: 'Listar',
            path: listPath,
          },
          {
            title: 'Crear',
            path: createPath,
          },
        ],
      }
    }),
  }))

  return actualModules || []
}
