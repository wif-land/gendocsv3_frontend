import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { IProcess } from '../../../../features/processes/domain/entities/IProcess'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { ProcessesUseCasesImpl } from '../../../processes/domain/usecases/ProcessServices'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export const useMigrateProcess = (moduleId: number) => {
  const [processes, setProcesses] = useState<IProcess[]>([])
  const [inputValue, setInputValue] = useState('' as string)
  const isOpen = useBoolean()
  const [loading, setIsLoading] = useState(false)
  const debouncedValue = useDebounce(inputValue)

  useEffect(() => {
    let isMounted = true

    if (isOpen.value === false) return

    setIsLoading(true)

    const fileteredProcesses = async (field: string) => {
      await ProcessesUseCasesImpl.getInstance()
        .getByFilters({ field }, moduleId, new PaginationDTO())
        .then((res) => {
          if (isMounted) {
            setProcesses(res.processes)
            return
          }

          setProcesses([])
          setIsLoading(false)
          return
        })
    }

    if (debouncedValue.includes('-')) return

    fileteredProcesses(debouncedValue)

    return () => {
      isMounted = false
    }
  }, [debouncedValue, isOpen.value])

  return {
    processes,
    setInputValue,
    loading,
    isOpen,
  }
}
