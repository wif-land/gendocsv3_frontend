/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentStore } from '../store/documentsStore'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import useModulesStore from '../../../../shared/store/modulesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { usePathname, useRouter } from 'next/navigation'
import {
  DENSE,
  NO_DENSE,
  getComparator,
  useTable,
} from '../../../../shared/sdk/table'
import {
  IDocumentTableFilterValue,
  IDocumentTableFilters,
} from '../components/DocumentTableToolbar'
import { defaultFilters } from '../constants/constants'
import { isEqual } from 'lodash'

export const useDocumentView = (moduleName: string) => {
  const { documents, setDocuments } = useDocumentStore()
  const { modules } = useModulesStore()
  const { loader } = useLoaderStore()
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState<IDocumentTableFilters>(defaultFilters)
  const [tableData, setTableData] = useState<DocumentModel[]>([])

  const moduleIdentifier =
    modules?.find((module) => module.code === moduleName.toUpperCase())?.id ?? 0

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  })

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const handleFilters = useCallback(
    (name: string, value: IDocumentTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  useEffect(() => {
    if (documents?.length) {
      setTableData(documents as DocumentModel[])
    }
  }, [documents])

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id!.toString() !== id)
      setTableData(deleteRow)

      table.onUpdatePageDeleteRow(dataInPage.length)
    },
    [dataInPage.length, table, tableData],
  )

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id!.toString()),
    )
    setTableData(deleteRows)

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    })
  }, [dataFiltered.length, dataInPage.length, table, tableData])

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}/edit`)
    },
    [router],
  )

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}`)
    },
    [router],
  )

  const canReset = !isEqual(defaultFilters, filters)

  const notFound =
    (!dataFiltered.length && canReset) ||
    (!loader.length && !dataFiltered.length)

  useEffect(() => {
    let isMounted = true

    const fetchingCouncils = async () => {
      if (!isMounted) return

      const result =
        await DocumentsUseCasesImpl.getInstance().getAllDocumentsByModuleId(
          moduleIdentifier,
        )

      if (result.documents) {
        setDocuments(result.documents)
        setTableData(result.documents)
      }
    }

    fetchingCouncils()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    loader,
    filters,
    table,
    tableData,
    dataFiltered,
    denseHeight,
    notFound,
    handleFilters,
    handleDeleteRow,
    handleDeleteRows,
    handleEditRow,
    handleViewRow,
  }
}

const applyFilter = ({
  inputData,
  comparator,
  filters,
}: {
  inputData: DocumentModel[]
  comparator: (a: any, b: any) => number
  filters: IDocumentTableFilters
}) => {
  let currentInputData = [...inputData]
  const { number } = filters

  const stabilizedThis = currentInputData.map(
    (el, index) => [el, index] as const,
  )

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  currentInputData = stabilizedThis.map((el) => el[0])

  if (number) {
    currentInputData = currentInputData.filter(
      (product) => product.number === number,
    )
  }

  return currentInputData
}
