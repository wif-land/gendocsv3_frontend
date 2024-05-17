import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { NewDefaultGradeSchema, resolveDefaultValues } from '../constants'
import { useDegCerGrades } from './useDegCerGrades'
import { IDegCerGrades } from '../../domain/entities/IDegCerGrades'
import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'

export const useDegCerGradesForm = ({
  certificateStatusId,
}: {
  certificateStatusId: number
}) => {
  const { handleCreate } = useDegCerGrades({ certificateStatusId })

  const methods = useForm({
    resolver: yupResolver(NewDefaultGradeSchema),
    defaultValues: resolveDefaultValues(),
  })

  const onSubmit = async (data: IDegCerGrades) => {
    await handleCreate(data as DegCerGradesModel)
    methods.reset()
  }

  return {
    methods,
    onSubmit,
  }
}
