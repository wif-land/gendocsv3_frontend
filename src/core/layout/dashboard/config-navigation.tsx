import useModulesStore from '../../../shared/store/modulesStore'
import Iconify from '../../iconify'

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
  buscar: icon('mdi:magnify'),
  procesos: icon('mdi:account-arrow-right'),
  estudiantes: icon('solar:user-bold'),
  funcionarios: icon('solar:user-broken'),
  carreras: icon('mdi:format-rotate-90'),
  usuarios: icon('mdi:account-check'),
  cargos: icon('mdi:account-child-circle'),
}

export const useNavData = () => {
  const { accessModules } = useModulesStore()

  const actualModules = accessModules?.map<INavItem>((module) => ({
    subheader: module.name,
    items: module.submodules.map<IRoute>((submodule) => ({
      title: submodule.name,
      path: `/dashboard/${module.code.toLowerCase()}/${submodule.name.toLowerCase()}`,
      icon: ICONS[submodule.name.toLowerCase()],
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
