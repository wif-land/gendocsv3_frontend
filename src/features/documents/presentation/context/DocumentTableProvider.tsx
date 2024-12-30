import React, { createContext, useContext, useState, ReactNode } from 'react'
import { IDocumentFilters } from '../components/DocumentTableToolbar'
import { defaultFilters } from '../constants/constants'
import useModulesStore from '@/shared/store/modulesStore'
import { DocumentModel } from '../../data/models/DocumentsModel'

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
}

const DocumentsTableContext = createContext<
  DocumentsTableContextProps | undefined
>(undefined)

export const DocumentsTableProvider: React.FC<{
  children: ReactNode
  moduleCode: string
}> = ({ moduleCode, children }) => {
  const { modules } = useModulesStore()
  const moduleIdentifier =
    modules?.find((module) => module.code === moduleCode.toUpperCase())?.id ?? 0

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
