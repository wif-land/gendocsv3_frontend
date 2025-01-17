import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { IDocumentFilters } from '../components/DocumentTableToolbar'
import { defaultFilters } from '../constants/constants'
import useModulesStore from '@/shared/store/modulesStore'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { resolveModuleId } from '@/shared/utils/ModuleUtil'
import useStore from '@/shared/hooks/use-store'
import { TableProps, useTable } from '@/shared/sdk/table'

interface DocumentsTableContextProps {
  filters: IDocumentFilters
  setFilters: (
    filters:
      | IDocumentFilters
      | ((prevState: IDocumentFilters) => IDocumentFilters),
  ) => void
  tableData: DocumentModel[]
  setTableData: (data: DocumentModel[]) => void
  visitedPages: number[]
  setVisitedPages: (pages: number[]) => void
  count: number
  setCount: (count: number) => void
  isDataFiltered: boolean
  setIsDataFiltered: (value: boolean) => void
  moduleIdentifier: number
  handleResetFilters: () => void
  table: TableProps
}

const DocumentsTableContext = createContext<
  DocumentsTableContextProps | undefined
>(undefined)

export const DocumentsTableProvider: React.FC<{
  children: ReactNode
  moduleCode: string
}> = ({ moduleCode, children }) => {
  const table = useTable()
  const modules = useStore(useModulesStore, (state) => state.modules)
  const [moduleIdentifier, setModuleIdentifier] = useState(0)

  useEffect(() => {
    if (!modules) return

    setModuleIdentifier(resolveModuleId(modules, moduleCode))
  }, [modules])

  const [filters, setFilters] = useState<IDocumentFilters>(
    defaultFilters(moduleIdentifier),
  )
  const [tableData, setTableData] = useState<DocumentModel[]>([])
  const [visitedPages, setVisitedPages] = useState<number[]>([])
  const [count, setCount] = useState(0)
  const [isDataFiltered, setIsDataFiltered] = useState(false)

  const handleResetFilters = () => {
    setFilters(defaultFilters(moduleIdentifier))
    setVisitedPages([])
    setIsDataFiltered(false)
    setTableData([])
  }

  return (
    <DocumentsTableContext.Provider
      value={{
        filters,
        setFilters,
        tableData,
        setTableData,
        visitedPages,
        setVisitedPages,
        count,
        setCount,
        isDataFiltered,
        setIsDataFiltered,
        moduleIdentifier,
        handleResetFilters,
        table,
      }}
    >
      {children}
    </DocumentsTableContext.Provider>
  )
}

export const useDocumentsTable = (): DocumentsTableContextProps => {
  const context = useContext(DocumentsTableContext)
  if (!context) {
    throw new Error(
      'useDocumentsTable must be used within a DocumentTableProvider',
    )
  }
  return context
}
