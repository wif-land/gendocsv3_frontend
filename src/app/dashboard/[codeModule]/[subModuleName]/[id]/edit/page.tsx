'use client'
import { useParams } from 'next/navigation'

import { ProcessEditView } from '../../../../../../features/processes/presentation/view'
import { CouncilEditView } from '../../../../../../features/council/presentation/view'
import { CareersEditView } from '../../../../../../features/careers/presentation/view'
import { FunctionaryEditView } from '../../../../../../features/functionaries/presentation/view'
import { StudentEditView } from '../../../../../../features/students/presentation/view'
import { PositionEditView } from '../../../../../../features/positions/presentation/view'
import { UsersEditView } from '../../../../../../features/users/presentation/view'
import { DegreeCertificateEditView } from '../../../../../../features/degree-certificates/presentation/views'

const Page = () => {
  const { subModuleName } = useParams()

  const routeToComponent = {
    estudiantes: StudentEditView,
    consejos: CouncilEditView,
    carreras: CareersEditView,
    funcionarios: FunctionaryEditView,
    procesos: ProcessEditView,
    cargos: PositionEditView,
    usuarios: UsersEditView,
    actas_de_grado: DegreeCertificateEditView,
  }

  const defaultComponent = () => <div>DEFAULT</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(subModuleName as string),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component />
}

export default Page
