import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { NewDefaultGradeSchema, resolveDefaultValues } from '../constants'
import { IDegCerGrades } from '../../domain/entities/IDegCerGrades'

export const useDegCerGradesForm = () => {
  const methods = useForm({
    resolver: yupResolver(NewDefaultGradeSchema),
    defaultValues: resolveDefaultValues(),
  })

  const onSubmit = (data: IDegCerGrades) => {
    console.log(data)
  }

  return {
    methods,
    onSubmit,
  }
}
