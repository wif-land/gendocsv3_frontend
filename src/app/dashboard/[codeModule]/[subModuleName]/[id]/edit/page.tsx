'use client'
import { useParams } from 'next/navigation'

import { ProcessEditView } from '../../../../../../features/processes/presentation/view'
import { CouncilEditView } from '../../../../../../features/council/presentation/view'
import { CareersEditView } from '../../../../../../features/careers/presentation/view'
import { FunctionaryEditView } from '../../../../../../features/functionaries/presentation/view'
import { StudentEditView } from '../../../../../../features/students/presentation/view'
import { PositionEditView } from '../../../../../../features/positions/presentation/view'

const Page = () => {
  const { subModuleName } = useParams()

  const routeToComponent = {
    estudiantes: StudentEditView,
    consejos: CouncilEditView,
    carreras: CareersEditView,
    funcionarios: FunctionaryEditView,
    procesos: ProcessEditView,
    cargos: PositionEditView,
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
