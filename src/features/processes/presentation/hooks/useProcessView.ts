import { useEffect, useState } from 'react'

import useLoaderStore from '../../../../shared/store/useLoaderStore'
import useModulesStore from '../../../../shared/store/modulesStore'

import { ProcessModel } from '../../data/models/ProcessesModel'

import { useProcessStore } from '../state/useProcessStore'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import { TableProps } from '../../../../shared/sdk/table/types'
import { useProcessesMethods } from './useProcessesMethods'
import { IProcess } from '../../domain/entities/IProcess'
import { IProcessFilters } from '../../domain/entities/IProcessFilters'

interface Props {
  table: TableProps
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IProcessFilters
  moduleId: string
}

export const useProcessView = ({
  table,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
  moduleId,
}: Props) => {
  const [tableData, setTableData] = useState<ProcessModel[]>([])
  const [count, setCount] = useState(0)
  const { processes, setProcesses } = useProcessStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, fetchDataByField } = useProcessesMethods()
  const { modules } = useModulesStore()
  const moduleIdentifier = resolveModuleId(modules, moduleId)

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0) return

    if (isMounted && !isDataFiltered) {
      fetchData(moduleIdentifier, table.rowsPerPage, table.page).then(
        (data) => {
          if (data.count === 0) return
          setProcesses(data.processes)
          setTableData(data.processes)
          setCount(data.count)
        },
      )
    }

    return () => {
      isMounted = false
    }
  }, [tableData, isDataFiltered])

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
        fetchDataByField(
          filters,
          moduleIdentifier,
          table.rowsPerPage,
          newPage,
        ).then((response) => {
          setProcesses([
            ...processes,
            ...(response.processes as ProcessModel[]),
          ])
          setTableData([
            ...processes,
            ...(response.processes as ProcessModel[]),
          ])
        })
      } else {
        fetchData(moduleIdentifier, table.rowsPerPage, newPage).then((data) => {
          if (data?.processes) {
            setProcesses([...processes, ...data.processes])
            setTableData([...processes, ...data.processes])
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

    if (isDataFiltered) {
      fetchDataByField(
        filters,
        moduleIdentifier,
        parseInt(event.target.value, 10),
        0,
      ).then((response) => {
        setProcesses(response.processes as ProcessModel[])
        setTableData(response.processes as ProcessModel[])
        setCount(response.count)
      })
    } else {
      fetchData(
        moduleIdentifier,
        parseInt(event.target.value, 10),
        table.page,
      ).then((data) => {
        if (data?.processes) {
          setProcesses(data.processes)
          setTableData(data.processes)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleUpdateRow = (row: IProcess) => {
    updateRow(row)
  }

  const handleSearch = (filters: IProcessFilters) => {
    fetchDataByField(
      filters,
      moduleIdentifier,
      table.rowsPerPage,
      table.page,
    ).then((response) => {
      setProcesses(response.processes as ProcessModel[])
      setTableData(response.processes as ProcessModel[])
      setCount(response.count)
      return
    })
  }

  return {
    count,
    tableData,
    loader,
    processes,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    // handleUpdateRows,
    handleSearch,
  }
}
