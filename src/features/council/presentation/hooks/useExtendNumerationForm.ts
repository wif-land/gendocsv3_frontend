import { useCouncilsStore } from '../store/councilsStore'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

type NumerationFormValues = {
  councilId: number
  newStart?: number | undefined
  newEnd?: number | undefined
  extendStart: boolean
  extendEnd: boolean
}

const resolveDefaultValues = () => ({
  councilId: 0,
  newStart: undefined,
  newEnd: undefined,
  extendStart: true,
  extendEnd: true,
})

const NewDocumentSchema = yup.object({
  councilId: yup.number().required(),
  newStart: yup.number(),
  newEnd: yup.number(),
  extendStart: yup.boolean().required(),
  extendEnd: yup.boolean().required(),
})

export const useExtendNumerationForm = () => {
  const router = useRouter()
  // const pathname = usePathname()
  // const { codeModule } = useParams()

  const { councils } = useCouncilsStore()
  // const moduleIdentifier = resolveModuleId(
  //   useModulesStore().modules,
  //   codeModule as string,
  // )

  const methods = useForm<NumerationFormValues>({
    defaultValues: resolveDefaultValues(),
    resolver: yupResolver(NewDocumentSchema),
  })

  const handleSubmit = (data: NumerationFormValues) => {
    console.log(data)
  }

  return {
    councils,
    methods,
    router,
    handleSubmit,
  }
}
