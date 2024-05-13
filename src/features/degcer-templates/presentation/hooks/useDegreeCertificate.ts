import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
// import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
// import useModulesStore from '../../../../shared/store/modulesStore'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'

interface Props {
  table: TableProps
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IDegreeCertificateFilters
}

export const useDegreeCertificateView = ({
  table,
  isDataFiltered,
  visitedPages,
  setVisitedPages,
}: Props) => {
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])
  const [count, setCount] = useState(0)
  const { degreeCertificates, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { loader } = useLoaderStore()
  const { fetchData } = useDegreeCertificateMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0) return

    if (isMounted && !isDataFiltered) {
      fetchData(table.rowsPerPage, table.page).then((data) => {
        if (data.count === 0) return
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
        setCount(data.count)
        console.log(data)
      })
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
      // if (isDataFiltered) {
      //   fetchDataByField(
      //     filters,
      //     moduleIdentifier,
      //     table.rowsPerPage,
      //     newPage,
      //   ).then((response) => {
      //     setDegreeCertificates([
      //       ...degreeCertificates,
      //       ...(response.councils as DegreeCertificateModel[]),
      //     ])
      //     setTableData([
      //       ...degreeCertificates,
      //       ...(response.councils as DegreeCertificateModel[]),
      //     ])
      //   })
      // } else {
      fetchData(table.rowsPerPage, newPage).then((data) => {
        if (data?.degreeCertificates) {
          setDegreeCertificates([
            ...degreeCertificates,
            ...data.degreeCertificates,
          ])
          setTableData([...degreeCertificates, ...data.degreeCertificates])
        }
      })
      // }
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    table.onChangeRowsPerPage(event)
    table.setPage(0)
    setTableData([])
    setVisitedPages([])

    // if (isDataFiltered) {
    //   fetchDataByField(
    //     filters,
    //     moduleIdentifier,
    //     parseInt(event.target.value, 10),
    //     0,
    //   ).then((response) => {
    //     if (response.councils.length > 0) {
    //       setDegreeCertificates(response.councils as DegreeCertificateModel[])
    //       setTableData(response.councils as DegreeCertificateModel[])
    //       setCount(response.count)
    //       return
    //     }

    //     setDegreeCertificates([])
    //     setTableData([])
    //     setCount(0)
    //   })
    // } else {
    fetchData(parseInt(event.target.value, 10), table.page).then((data) => {
      if (data?.degreeCertificates) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
      }
      if (data?.count) {
        setCount(data.count)
      }
    })
    // }
  }

  // const handleUpdateRow = (row: IDegreeCertificate) => {
  //   updateRow(row).then((data) => {
  //     if (data) {
  //       setDegreeCertificates(
  //         degreeCertificates.map((council) =>
  //           council.id === data.id ? (data as DegreeCertificateModel) : council,
  //         ),
  //       )
  //       setTableData(
  //         degreeCertificates.map((functionary) =>
  //           functionary.id === data.id
  //             ? (data as DegreeCertificateModel)
  //             : functionary,
  //         ),
  //       )
  //     }
  //   })
  // }

  // const handleSearch = (filters: IDegreeCertificateFilters) => {
  //   fetchDataByField(
  //     filters,
  //     moduleIdentifier,
  //     table.rowsPerPage,
  //     table.page,
  //   ).then((response) => {
  //     if (response.councils.length > 0) {
  //       setDegreeCertificates(response.councils as DegreeCertificateModel[])
  //       setTableData(response.councils as DegreeCertificateModel[])
  //       setCount(response.count)
  //       return
  //     }

  //     setDegreeCertificates([])
  //     setTableData([])
  //     setCount(0)
  //     return
  //   })
  // }

  return {
    count,
    tableData,
    loader,
    councils: degreeCertificates,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    // handleUpdateRow,
    // handleSearch,
  }
}
