/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDocument } from '../../domain/entities/IDocument'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NewDocumentSchema, resolveDefaultValues } from '../constants/constants'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useCouncilStore } from '../../../council/presentation/store/councilsStore'
import { CouncilsUseCasesImpl } from '../../../council/domain/usecases/CouncilServices'
import { NumerationModel } from '../../data/models/NumerationModel'
import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'
import { IModule } from '../../../modules/types/IModule'
import useModulesStore from '../../../../shared/store/modulesStore'
import { ProcessesUseCasesImpl } from '../../../processes/domain/usecases/ProcessServices'
import { ProcessModel } from '../../../processes/data/models/ProcessesModel'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import { StudentUseCasesImpl } from '../../../students/domain/usecases/StudentServices'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { useFunctionaryStore } from '../../../functionaries/presentation/state/useFunctionaryStore'
import { FunctionaryUseCasesImpl } from '../../../functionaries/domain/usecases/FunctionaryServices'

export const useDocumentsForm = (currentDocument?: DocumentModel) => {
  const router = useRouter()
  const pathname = usePathname()
  const { codeModule } = useParams()

  const resolveModuleId = (modules: IModule[], codeModule: string) => {
    const module = modules.find(
      (module) => module.code === (codeModule as string).toUpperCase(),
    )

    return module?.id
  }

  const isCouncilSelected = useBoolean(false)
  const isProcessSelected = useBoolean(false)
  const isTemplateSelected = useBoolean(false)

  const { councils, setCouncils } = useCouncilStore()
  const { processes, setProcesses } = useProcessStore()
  const { students, setStudents } = useStudentStore()
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { user } = useAccountStore()

  const [selectedProcess, setSelectedProcess] = useState<ProcessModel>(
    {} as ProcessModel,
  )
  const [numbers, setNumbers] = useState<NumerationModel>(
    NumerationModel.fromJson({}),
  )

  const [moduleId, setModuleId] = useState<number>(
    resolveModuleId(useModulesStore().modules, codeModule as string) || 0,
  )

  const defaultValues: Partial<DocumentModel> = useMemo(
    () => resolveDefaultValues(currentDocument),
    [currentDocument],
  )
  const methods = useForm<DocumentModel>({
    // @ts-expect-error - The resolver is not being recognized
    resolver: yupResolver(NewDocumentSchema),
    defaultValues,
  })

  const values = methods.watch()

  if (values.councilId && !isCouncilSelected.value) {
    isCouncilSelected.onTrue()
  }

  const handleCreateDocument = async (values: IDocument) =>
    await DocumentsUseCasesImpl.getInstance().create(values)

  const onSubmit = useCallback(
    async (data: IDocument) => {
      const result = await handleCreateDocument(
        DocumentModel.fromJson({
          ...data,
          userId: user?.id,
        }),
      )

      if (!result) {
        return
      }

      methods.reset()
      router.push(pathname.replace('/new', ''))
    },
    [currentDocument, enqueueSnackbar, methods.reset, router],
  )

  useEffect(() => {
    if (!values.councilId) {
      return
    }

    DocumentsUseCasesImpl.getInstance()
      .getNumerationByCouncil(values.councilId as number)
      .then((result) => {
        setNumbers(result)
        methods.setValue('number', result.nextAvailableNumber)
      })
  }, [values.councilId])

  useEffect(() => {
    if (!values.templateId) {
      return
    }

    isTemplateSelected.onTrue()
  }, [values.templateId])

  useEffect(() => {
    if (!moduleId) {
      setModuleId(
        resolveModuleId(useModulesStore().modules, codeModule as string) || 0,
      )
      return
    }

    CouncilsUseCasesImpl.getInstance()
      .getAllCouncilsByModuleId(moduleId, 10, 0)
      .then((result) => {
        if (result.councils) {
          setCouncils(result.councils)
        }
      })

    ProcessesUseCasesImpl.getInstance()
      .getAllProcessesByModuleId(moduleId, 10, 0)
      .then((result) => {
        if (result.processes) {
          setProcesses(result.processes)
        }
      })

    StudentUseCasesImpl.getInstance()
      .getAll(10, 0)
      .then((result) => {
        if (result.students) {
          setStudents(result.students)
        }
      })

    FunctionaryUseCasesImpl.getInstance()
      .getAll(10, 0)
      .then((result) => {
        if (result.functionaries) {
          setFunctionaries(result.functionaries)
        }
      })
  }, [])

  return {
    councils,
    processes,
    isCouncilSelected,
    methods,
    isProcessSelected,
    isTemplateSelected,
    numbers,
    selectedProcess,
    students,
    functionaries,
    onSubmit,
    setProcesses,
    setSelectedProcess,
  }
}
