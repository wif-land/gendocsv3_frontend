import * as Yup from 'yup'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { useCouncilStore } from '../store/councilsStore'
import { CouncilModel } from '../../data/models/CouncilModel'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { CouncilType, ICouncil } from '../../domain/entities/ICouncil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useFunctionaryStore } from '../../../../shared/store/functionaryStore'
import { usePathname, useRouter } from 'next/navigation'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

interface FormValuesProps extends ICouncil {
  president: string
  subrogant: string
}

export const useCouncilsForm = (currentCouncil?: ICouncil) => {
  const { councils, addCouncil, setCouncils } = useCouncilStore()
  const { functionaries, get } = useFunctionaryStore()
  const [unusedFunctionaries, setUnusedFunctionaries] = useState<
    IFunctionary[]
  >([])
  const router = useRouter()
  const pathname = usePathname()
  const NewCouncilSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    date: Yup.date().required('La fecha es requerida'),
    type: Yup.string().required('El tipo es requerido'),
    isActive: Yup.boolean().required('El estado es requerido'),
    isArchived: Yup.boolean().required('El estado es requerido'),
    president: Yup.string().required('El presidente es requerido'),
    subrogant: Yup.string().required('El subrogante es requerido'),
    attendees: Yup.array()
      .of(Yup.string())
      .required('Los asistentes son requeridos'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentCouncil?.name || '',
      date: currentCouncil?.date || new Date(Date.now() + 200),
      type: currentCouncil?.type || CouncilType.ORDINARY,
      isActive: currentCouncil?.isActive || false,
      isArchived: currentCouncil?.isArchived || false,
      president: '',
      subrogant: '',
      attendees: currentCouncil?.attendees || [''],
    }),
    [currentCouncil],
  )

  const methods = useForm<FormValuesProps>({
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    resolver: yupResolver(NewCouncilSchema),
    defaultValues,
  })

  const { reset, watch } = methods
  const values = watch()

  const handleAddAttendees = () => {
    const attendees = values.attendees as string[]

    if (attendees.length >= 10) return
    if (attendees.length > 0 && attendees[attendees.length - 1] === '') return

    attendees.push('')
    methods.setValue('attendees', attendees)
  }

  const handleDeleteAttendeesQuantity = (index: number) => {
    const attendees = values.attendees as string[]
    attendees.splice(index, 1)
  }

  const handleCreateCouncil = async (values: ICouncil) => {
    const result = await CouncilsUseCasesImpl.getInstance().create(values)

    if (!result.council) {
      throw new Error('Error al crear el consejo')
    }

    addCouncil(result.council)
    enqueueSnackbar('Consejo creado exitosamente')
  }

  const handleUpdateCouncil = async (
    id: number,
    editedFields: Partial<ICouncil>,
  ) => {
    const { status } = await CouncilsUseCasesImpl.getInstance().update(
      id,
      editedFields,
    )

    if (status !== HTTP_STATUS_CODES.OK) {
      throw new Error('Error al crear el consejo')
    }

    setCouncils(
      councils!.map((council) =>
        council.id === id
          ? new CouncilModel({
              ...council,
              ...editedFields,
            })
          : council,
      ),
    )
    enqueueSnackbar('Consejo actualizado exitosamente')
  }

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        console.info('DATA', data)

        if (!currentCouncil) {
          await handleCreateCouncil(data)
        } else {
          await handleUpdateCouncil(currentCouncil.id as number, data)
        }

        router.push(
          currentCouncil
            ? pathname.replace(new RegExp(`/${currentCouncil.id}/edit`), '')
            : pathname.replace('/new', ''),
        )
        reset()
      } catch (error) {
        enqueueSnackbar(
          !currentCouncil
            ? 'Error al crear el consejo'
            : 'Error al actualizar el consejo',
        )
      }
    },
    [currentCouncil, enqueueSnackbar, reset, router],
  )

  useEffect(() => {
    if (currentCouncil) {
      reset(defaultValues)
    }
  }, [reset, currentCouncil])

  useEffect(() => {
    if (!functionaries) return

    const [president, subrogant, attendees] = [
      functionaries.find(
        (functionary) =>
          functionary.dni === values.president?.split('-')[1]?.trim(),
      ),
      functionaries.find(
        (functionary) =>
          functionary.dni === values.subrogant?.split('-')[1]?.trim(),
      ),
      (values.attendees as string[]).map(
        (attendee) => attendee.split('-')[1]?.trim(),
      ),
    ]

    const currentUnusedFunctionaries = functionaries.filter(
      (functionary) =>
        functionary.dni !== president?.dni &&
        functionary.dni !== subrogant?.dni &&
        !attendees.includes(functionary.dni),
    )

    setUnusedFunctionaries(currentUnusedFunctionaries)
  }, [values.attendees, values.president, values.subrogant])

  useEffect(() => {
    if (!functionaries) {
      get()
      return
    }

    setUnusedFunctionaries(functionaries)
  }, [])

  return {
    councils,
    methods,
    unusedFunctionaries,
    defaultValues,
    handleAddAttendees,
    handleDeleteAttendeesQuantity,
    setCouncils,
    handleUpdateCouncil,
    onSubmit,
  }
}
