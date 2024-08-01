import { useEffect, useState } from 'react'
import useModulesStore from '../../../shared/store/modulesStore'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'
import Iconify from '../../iconify'
import { useRouter } from 'next/navigation'
import { LogoutUseCase } from '../../../features/auth/domain/usecases/logoutUseCase'
import { IModule } from '@/features/modules/types/IModule'

interface IRoute {
  title: string
  path: string
  icon?: JSX.Element
  children?: IRoute[]
}

interface INavItem {
  header?: string
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
  procesos: icon('clarity:process-on-vm-line'),
  estudiantes: icon('solar:user-bold'),
  funcionarios: icon('solar:user-broken'),
  carreras: icon('mdi:format-rotate-90'),
  usuarios: icon('mdi:account-check'),
  cargos: icon('mdi:account-child-circle'),
  representantes: icon('mdi:account-multiple'),
}

export const useNavConfig = () => {
  const { user, retreiveFromCookie } = useAccountStore()
  const { accessModules, setAccessModules, modules } = useModulesStore()
  const [firstUni, setFirstUni] = useState<IModule | undefined>()

  useEffect(() => {
    if (!modules.length) {
      return
    }

    if (user && user.id === 0) {
      retreiveFromCookie().then(async (isLogged) => {
        if (!isLogged) {
          new LogoutUseCase().call()
        }
      })
      return
    }

    if (user && user.accessModules) {
      setAccessModules(user.accessModules)
      setFirstUni(
        accessModules?.find((module) =>
          module.code.toUpperCase().includes('UNI'),
        ) || undefined,
      )
      return
    }
  }, [user, modules])

  const actualModules = accessModules?.map<INavItem>((module) => ({
    header: firstUni?.code === module.code ? 'Unidad de titulación' : undefined,
    subheader: module.name,
    items: module.submodules.map<IRoute>((submodule) => {
      const mainPath = `/dashboard/${module.code
        .toLowerCase()
        .replaceAll(' ', '_')}/${submodule.name
          .toLowerCase()
          .replaceAll(' ', '_')}`
      const listPath = `${mainPath}`
      const createPath = `${mainPath}/new`

      return submodule.id !== 10
        ? {
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
        : {
          title: submodule.name,
          path: mainPath,
          icon: ICONS[submodule.name.toLowerCase().replaceAll(' ', '')],
        }
    }),
  }))

  return actualModules || []
}
