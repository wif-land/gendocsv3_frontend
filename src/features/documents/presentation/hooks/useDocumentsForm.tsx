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
import { useCouncilsStore } from '../../../council/presentation/store/councilsStore'
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
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { useDebounce } from '@/shared/hooks/use-debounce'

interface IDocumentsForm {
  student: {
    id: number
    label: string
  } | null
  processId: {
    id: number
    label: string
  }
  councilId: {
    id: number
    label: string
  }
  number: number
  userId: number
  templateId: number
  functionariesIds?: {
    id: number
    label: string
  }[]
  description: string | undefined
}

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

  const { councils, setCouncils } = useCouncilsStore()
  const { processes, setProcesses } = useProcessStore()
  const { students, setStudents } = useStudentStore()
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { user } = useAccountStore()
  const [searchCouncilField, setSearchCouncilField] = useState('')
  const [searchProcessField, setSearchProcessField] = useState('')
  const [searchStudentField, setSearchStudentField] = useState('')

  const [selectedProcess, setSelectedProcess] = useState<ProcessModel>(
    {} as ProcessModel,
  )
  const [numbers, setNumbers] = useState<NumerationModel>(
    NumerationModel.fromJson({}),
  )

  const [moduleId, setModuleId] = useState<number>(
    resolveModuleId(useModulesStore().modules, codeModule as string) || 0,
  )

  const defaultValues: IDocumentsForm = useMemo(
    () => resolveDefaultValues(),
    [currentDocument],
  )
  const methods = useForm<IDocumentsForm>({
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
    async (data: IDocumentsForm) => {
      const result = await handleCreateDocument(
        DocumentModel.fromJson({
          ...data,
          userId: user?.id,
          councilId: data.councilId.id,
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

  const getSelectedStudent = () => {
    const student = students.find(
      (student) => student.id === methods.watch('student')?.id,
    )

    if (!student) return null

    return {
      id: student?.id as number,
      label: `${student?.dni} - ${student?.firstLastName} ${student?.secondLastName} ${student?.firstName}`,
    }
  }

  const searchDebounced = useDebounce(searchCouncilField)
  const searchProcessDebounced = useDebounce(searchProcessField)
  const searchStudentDebounced = useDebounce(searchStudentField)

  useEffect(() => {
    let isMounted = true
    if (!searchDebounced) {
      return
    }

    CouncilsUseCasesImpl.getInstance()
      .getByFilters(
        {
          name: searchDebounced,
          state: true,
        },
        moduleId,
        new PaginationDTO(),
      )
      .then((result) => {
        if (!isMounted) {
          return
        }

        if (result.councils) {
          setCouncils(result.councils)
        }
      })

    return () => {
      isMounted = false
    }
  }, [searchDebounced])

  useEffect(() => {
    let isMounted = true
    if (!searchProcessDebounced) {
      return
    }

    ProcessesUseCasesImpl.getInstance()
      .getByFilters(
        {
          field: searchProcessDebounced,
          state: true,
        },
        moduleId,
        new PaginationDTO(),
      )
      .then((result) => {
        if (!isMounted) {
          return
        }

        if (result.processes) {
          setProcesses(result.processes)
        }
      })

    return () => {
      isMounted = false
    }
  }, [searchProcessDebounced])

  useEffect(() => {
    let isMounted = true
    if (searchStudentDebounced.includes('-')) {
      return
    }
    if (!searchStudentDebounced) {
      return
    }

    StudentUseCasesImpl.getInstance()
      .getByFilters(
        {
          field: searchStudentDebounced,
          state: true,
        },
        new PaginationDTO(),
      )
      .then((result) => {
        if (!isMounted) {
          return
        }

        if (result.students) {
          setStudents(result.students)
        }
      })

    return () => {
      isMounted = false
    }
  }, [searchStudentDebounced])

  useEffect(() => {
    if (!values.councilId) {
      return
    }

    DocumentsUseCasesImpl.getInstance()
      .getNumerationByCouncil(values.councilId.id as number)
      .then((result) => {
        setNumbers(result)
        methods.setValue('number', result.nextAvailableNumber)
      })
  }, [values.councilId])

  useEffect(() => {
    if (!values.processId) {
      return
    }

    processes.forEach((process) => {
      if (process.isActive && process.id === values.processId.id) {
        setSelectedProcess(process)
        isProcessSelected.onTrue()
      }
    })
  }, [values.processId])

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
      .getByFilters(
        {
          state: true,
        },
        moduleId,
        new PaginationDTO(),
      )
      .then((result) => {
        if (result.councils) {
          setCouncils(result.councils)
        }
      })

    ProcessesUseCasesImpl.getInstance()
      .getAllProcessesByModuleId(moduleId, new PaginationDTO())
      .then((result) => {
        if (result.processes) {
          setProcesses(result.processes.filter((process) => process.isActive))
        }
      })

    StudentUseCasesImpl.getInstance()
      .getAll(new PaginationDTO())
      .then((result) => {
        if (result.students) {
          setStudents(result.students)
        }
      })

    FunctionaryUseCasesImpl.getInstance()
      .getAll(new PaginationDTO())
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
    getSelectedStudent,
    setSearchCouncilField,
    setSearchProcessField,
    setSearchStudentField,
  }
}
