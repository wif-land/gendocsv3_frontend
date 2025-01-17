/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { usePathname, useRouter } from 'next/navigation'
import { DENSE, NO_DENSE, useTable } from '../../../../shared/sdk/table'
import {
  IDocumentTableFilterValue,
  IDocumentFilters,
} from '../components/DocumentTableToolbar'
import { useDocumentsMethods } from './useDocumentsMethods'
import { useDocumentsTable } from '../context/DocumentTableProvider'
import { INotifyStudentOptions } from '../components/DocumentTableRow'
import useStore from '@/shared/hooks/use-store'
import useModulesStore from '@/shared/store/modulesStore'
import { resolveModuleId } from '@/shared/utils/ModuleUtil'

export const useDocumentView = (moduleId: string) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const [moduleIdentifier, setModuleIdentifier] = useState(0)
  const {
    count,
    filters,
    isDataFiltered,
    setIsDataFiltered,
    setCount,
    setFilters,
    setTableData,
    setVisitedPages,
    tableData,
    visitedPages,
    handleResetFilters,
  } = useDocumentsTable()

  const modules = useStore(useModulesStore, (state) => state.modules)

  useEffect(() => {
    let isMounted = true

    if (!isMounted || !modules || modules.length === 0 || !moduleId) return

    setModuleIdentifier(resolveModuleId(modules, moduleId))

    return () => {
      isMounted = false
    }
  }, [modules, moduleId])

  useEffect(() => {
    let isMounted = true

    if (moduleIdentifier !== 0) return

    if (isMounted) {
      router.refresh()
    }

    return () => {
      isMounted = false
    }
  }, [moduleIdentifier])

  const {
    documents,
    fetchData,
    deleteDocument,
    loader,
    setDocuments,
    notifyStudent,
  } = useDocumentsMethods()

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const handleFilters = useCallback(
    (name: string, value: IDocumentTableFilterValue) => {
      table.onResetPage()
      setFilters(
        (prevState: IDocumentFilters) =>
          ({
            ...prevState,
            [name]: value,
          }) as IDocumentFilters,
      )
      setIsDataFiltered(true)
    },
    [table],
  )

  useEffect(() => {
    if (documents?.length && moduleIdentifier !== 0) {
      setTableData(documents as DocumentModel[])
    }
  }, [documents])

  const handleDeleteRow = useCallback(
    async (id: number) => {
      const deleted = await deleteDocument(id)
      if (!deleted) return

      setDocuments(documents.filter((doc) => doc.id !== id))

      const filterOutRowById = tableData.filter((row) => row.id !== id)
      setTableData(filterOutRowById)
    },
    [table, tableData],
  )

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}/edit`)
    },
    [router],
  )

  const handleViewRow = useCallback(
    (id: string, driveId: string) => {
      router.push(`${pathname}/${id}/view/${driveId}`)
    },
    [router],
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    table.setPage(newPage)

    if (visitedPages.includes(newPage)) {
      return
    } else {
      visitedPages.push(newPage)
    }

    if (newPage > table.page) {
      if (isDataFiltered) {
        fetchData(filters, table.rowsPerPage, newPage).then((response) => {
          if (response?.count === 0) return
          setDocuments([...documents, ...response.documents])
          setTableData([...documents, ...response.documents])
        })
      } else {
        fetchData(filters, table.rowsPerPage, newPage).then((data) => {
          if (data?.documents) {
            setDocuments([...documents, ...data.documents])
            setTableData([...documents, ...data.documents])
          }
        })
      }
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    table.onChangeRowsPerPage(event)
    table.setPage(0)
    setTableData([])
    setVisitedPages([])
    const rowsPerPage = parseInt(event.target.value, 10)

    if (isDataFiltered) {
      fetchData(filters, rowsPerPage, table.page).then((response) => {
        if (response?.count === 0) return
        setDocuments(response.documents)
        setTableData(response.documents)
        setCount(response.count)
      })
    } else {
      fetchData(filters, rowsPerPage, table.page).then((data) => {
        if (data?.documents) {
          setDocuments(data.documents)
          setTableData(data.documents)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  useEffect(() => {
    let isMounted = true
    // if (tableData.length !== 0) return
    if (!isMounted || !moduleIdentifier || !modules) return

    const mid = resolveModuleId(modules, moduleId)

    const fetchDocuments = async () => {
      if (!isMounted) return

      const result = await fetchData(
        {
          ...filters,
          moduleId: mid,
        },
        table.rowsPerPage,
        table.page,
      )

      if (result) {
        setDocuments(result.documents)
        setTableData(result.documents)
        setCount(result.count)
      }
    }

    fetchDocuments()

    return () => {
      isMounted = false
    }
  }, [moduleIdentifier, filters])

  const getFilteredDocuments = (filters: IDocumentFilters) => {
    fetchData(filters, table.rowsPerPage, table.page).then((response) => {
      if (response?.count > 0) {
        setDocuments(response.documents)
        setTableData(response.documents)
        setCount(response.count)

        return
      }

      setDocuments([])
      setTableData([])
      setCount(0)
      return
    })
  }

  const handleNotifyStudent = async (
    id: number,
    options?: INotifyStudentOptions,
  ) => {
    const link = await notifyStudent(id, options)

    if (link) {
      window.open(link, '_blank')
    }

    handleResetFilters()
  }

  return {
    count,
    loader,
    filters,
    setFilters,
    moduleIdentifier,
    table,
    tableData,
    denseHeight,
    isDataFiltered,
    setIsDataFiltered,
    setTableData,
    setVisitedPages,
    handleChangePage,
    handleFilters,
    handleDeleteRow,
    handleEditRow,
    handleViewRow,
    getFilteredDocuments,
    handleResetFilters,
    handleNotifyStudent,
    handleChangeRowsPerPage,
  }
}
