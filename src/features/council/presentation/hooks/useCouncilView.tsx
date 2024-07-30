import { useCouncilsStore } from '../store/councilsStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useCouncilsMethods } from './useCouncilsMethods'
import useModulesStore from '../../../../shared/store/modulesStore'
import { CouncilModel } from '../../data/models/CouncilModel'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { IUpdateCouncil } from '../../domain/entities/ICouncil'
import { useDefaultMembersStore } from '../../../../features/default-members/presentation/store/defaultMembersStore'

interface Props {
  table: TableProps
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: ICouncilFilters
  moduleId: string
}

export const useCouncilView = ({
  table,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
  moduleId,
}: Props) => {
  const [tableData, setTableData] = useState<CouncilModel[]>([])
  const [count, setCount] = useState(0)
  const { councils, setCouncils } = useCouncilsStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, fetchDataByField } = useCouncilsMethods()
  const { modules } = useModulesStore()
  const { getByModuleId } = useDefaultMembersStore()

  const currentModule = modules?.find(
    (module) => module.code === moduleId.toLocaleUpperCase(),
  )
  const compilationTemplateDriveId = currentModule?.compilationTemplateDriveId
  const separatorTemplateDriveId = currentModule?.separatorTemplateDriveId

  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0) return

    if (isMounted && !isDataFiltered) {
      fetchData(moduleIdentifier, table.rowsPerPage, table.page).then(
        (data) => {
          if (data.count === 0) return
          setCouncils(data.councils)
          setTableData(data.councils)
          setCount(data.count)
        },
      )
    }

    return () => {
      isMounted = false
    }
  }, [tableData, isDataFiltered])

  useEffect(() => {
    getByModuleId(moduleIdentifier)
  }, [])

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
          setCouncils([...councils, ...(response.councils as CouncilModel[])])
          setTableData([...councils, ...(response.councils as CouncilModel[])])
        })
      } else {
        fetchData(moduleIdentifier, table.rowsPerPage, newPage).then((data) => {
          if (data?.councils) {
            setCouncils([...councils, ...data.councils])
            setTableData([...councils, ...data.councils])
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
        if (response.councils.length > 0) {
          setCouncils(response.councils as CouncilModel[])
          setTableData(response.councils as CouncilModel[])
          setCount(response.count)
          return
        }

        setCouncils([])
        setTableData([])
        setCount(0)
      })
    } else {
      fetchData(
        moduleIdentifier,
        parseInt(event.target.value, 10),
        table.page,
      ).then((data) => {
        if (data?.councils) {
          setCouncils(data.councils)
          setTableData(data.councils)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleUpdateRow = (row: IUpdateCouncil) => {
    updateRow(row).then((data) => {
      if (data) {
        setCouncils(
          councils.map((council) =>
            council.id === data.id ? (data as CouncilModel) : council,
          ),
        )
        setTableData(
          councils.map((council) =>
            council.id === data.id ? (data as CouncilModel) : council,
          ),
        )
      }
    })
  }

  const handleSearch = (filters: ICouncilFilters) => {
    fetchDataByField(
      filters,
      moduleIdentifier,
      table.rowsPerPage,
      table.page,
    ).then((response) => {
      if (response.councils.length > 0) {
        setCouncils(response.councils as CouncilModel[])
        setTableData(response.councils as CouncilModel[])
        setCount(response.count)
        return
      }

      setCouncils([])
      setTableData([])
      setCount(0)
      return
    })
  }

  return {
    count,
    tableData,
    loader,
    councils,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleSearch,
    compilationTemplateDriveId,
    separatorTemplateDriveId,
    moduleIdentifier,
  }
}
