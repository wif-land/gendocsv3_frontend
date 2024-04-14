import { useCallback, useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useCouncilsMethods } from '../../../council/presentation/hooks/useCouncilsMethods'
import { useTable } from '../../../../shared/sdk/table'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import {
  IDegreeCertificateTableFilterValue,
  IDegreeCertificateTableFilters,
} from '../components/DegreeCertificateTableToolbar'
import { DegreeCertificateModel } from '../../data/models/CertificateDegreeModel'
import { defaultFilters } from '../constants'

export const useDegreeCertificateView = (moduleId: string) => {
  const table = useTable()
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])
  const isDataFiltered = useBoolean()
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const { loader } = useLoaderStore()
  const { fetchData, fetchDataByField } = useCouncilsMethods()
  const { modules } = useModulesStore()
  const [searchTerm, setSearchTerm] = useState('')

  const handleResetFilters = () => {
    setFilters(defaultFilters as IDegreeCertificateTableFilters)
    setSearchTerm('')
    setVisitedPages([])
    isDataFiltered.onFalse()
    setTableData([])
  }

  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  const [filters, setFilters] = useState<IDegreeCertificateTableFilters>(
    defaultFilters as IDegreeCertificateTableFilters,
  )

  const handleFilters = useCallback(
    (name: string, value: IDegreeCertificateTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0) return

    if (isMounted && !isDataFiltered) {
      fetchData(moduleIdentifier, table.rowsPerPage, table.page).then(
        (data) => {
          if (data.count === 0) return
          setTableData([])
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
          {
            name: searchTerm,
          },
          moduleIdentifier,
          table.rowsPerPage,
          newPage,
        ).then((response) => {
          if (response?.status === HTTP_STATUS_CODES.OK) {
            setTableData([
              ...(response.data.councils as DegreeCertificateModel[]),
            ])
          }
        })
      } else {
        fetchData(moduleIdentifier, table.rowsPerPage, newPage).then((data) => {
          if (data?.councils) {
            setTableData([])
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
        {
          name: searchTerm,
        },
        moduleIdentifier,
        parseInt(event.target.value, 10),
        0,
      ).then((response) => {
        if (response?.status === HTTP_STATUS_CODES.OK) {
          setTableData(response.data.councils as DegreeCertificateModel[])
          setCount(response.data.count)
        }

        if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
          setTableData([])
          setCount(0)
        }
      })
    } else {
      fetchData(
        moduleIdentifier,
        parseInt(event.target.value, 10),
        table.page,
      ).then((data) => {
        if (data?.councils) {
          setTableData([])
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  const handleSearch = (field: string) => {
    fetchDataByField(
      {
        name: field,
      },
      moduleIdentifier,
      table.rowsPerPage,
      table.page,
    ).then((response) => {
      if (response?.status === HTTP_STATUS_CODES.OK) {
        setTableData(response.data.councils as DegreeCertificateModel[])
        setCount(response.data.count)
        return
      }

      if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
        setTableData([])
        setCount(0)
        return
      }
    })
  }

  return {
    count,
    table,
    isDataFiltered,
    searchTerm,
    setSearchTerm,
    tableData,
    loader,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    setVisitedPages,
    handleResetFilters,
    handleFilters,
    filters,
  }
}
