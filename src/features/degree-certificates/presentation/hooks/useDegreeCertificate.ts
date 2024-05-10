import { useCallback, useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'

import { useCouncilsMethods } from '../../../council/presentation/hooks/useCouncilsMethods'
import { TableProps, useTable } from '../../../../shared/sdk/table'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import {
  IDegreeCertificateTableFilterValue,
  IDegreeCertificateTableFilters,
} from '../components/DegreeCertificateTableToolbar'
import { DegreeCertificateModel } from '../../data/models/model'
import { defaultFilters } from '../constants'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'

interface Props {
  tableData: IDegreeCertificate[]
  setTableData: (data: IDegreeCertificate[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IDegreeCertificateTableFilters
}

export const useDegreeCertificateView = ({
  tableData,
  setTableData,
  table,
  setCount,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
  filters,
}: Props) => {
  const { loader } = useLoaderStore()
  const { degreeCertificate, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { fetchData, updateRow, fetchDataByField } =
    useDegreeCertificateMethods()

  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    const isMounted = true
    if (tableData.length === 0) {
      if (isMounted && !isDataFiltered) {
        fetchData(table.rowsPerPage, table.page).then((data) => {
          if (data?.councils) {
            setTableData(data.councils)
            setDegreeCertificates(data.councils)
          }
          if (data?.count) {
            setCount(data.count)
          }
        })
      }
    }
  })

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
