import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useCallback, useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { usePathname, useRouter } from 'next/navigation'
import { IDegreeCertificateTableFilters } from '../components/DegreeCertificateTableToolbar'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { defaultFilters } from '../constants'

interface Props {
  table: TableProps
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
}

export const useDegreeCertificateView = ({
  table,
  visitedPages,
  setVisitedPages,
}: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] =
    useState<IDegreeCertificateTableFilters>(defaultFilters)
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])
  const [firstCharge, setFirstCharge] = useState<boolean>(true)
  const [prevCareer, setPrevCareer] = useState<number>(1)
  const [count, setCount] = useState(0)
  const { degreeCertificates, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { loader } = useLoaderStore()
  const {
    fetchData,
    toggleIsClosed,
    generateDocument,
    generateNumeration,
    getReports,
    downloadReport,
  } = useDegreeCertificateMethods()

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const data = await fetchData(
          table.rowsPerPage,
          table.page,
          filters.careerId || 1,
        )
        if (isMounted && data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          setFirstCharge(false)
          setPrevCareer(filters.careerId || 1)
        }
      } catch (error) {}
    }

    const loadReportData = async () => {
      try {
        const data = await getReports(
          filters.isEnd || false,
          filters as IDegreeCertificateFilters,
        )
        if (isMounted && data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          setFirstCharge(false)
          setPrevCareer(filters.careerId || 1)
        }
      } catch (error) {}
    }

    if (
      isMounted &&
      (filters.careerId !== prevCareer || firstCharge) &&
      filters.isReport === false
    ) {
      loadData()
    } else if (filters.isReport === true) {
      loadReportData()
    }

    return () => {
      isMounted = false
    }
  }, [filters.careerId, filters.isReport, table.page, table.rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    table.setPage(newPage)

    if (visitedPages.includes(newPage)) {
      return
    } else {
      visitedPages.push(newPage)
    }

    if (newPage > table.page) {
      if (filters.isReport === true) {
        getReports(
          filters.isEnd || false,
          filters as IDegreeCertificateFilters,
        ).then((data) => {
          if (data?.degreeCertificates) {
            setDegreeCertificates([
              ...degreeCertificates,
              ...data.degreeCertificates,
            ])
            setTableData([...degreeCertificates, ...data.degreeCertificates])
          }
        })
      } else {
        fetchData(table.rowsPerPage, newPage, filters.careerId || 1).then(
          (data) => {
            if (data?.degreeCertificates) {
              setDegreeCertificates([
                ...degreeCertificates,
                ...data.degreeCertificates,
              ])
              setTableData([...degreeCertificates, ...data.degreeCertificates])
            }
          },
        )
      }
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    table.onChangeRowsPerPage(event)
    table.setPage(0)
    setTableData([])
    setVisitedPages([])

    if (filters.isReport === true) {
      getReports(
        filters.isEnd || false,
        filters as IDegreeCertificateFilters,
      ).then((data) => {
        if (data?.degreeCertificates.length > 0) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          if (data?.count) {
            setCount(data.count)
          }
          return
        }
        setDegreeCertificates([])
        setTableData([])
        setCount(0)
      })
    } else {
      fetchData(newRowsPerPage, table.page, filters.careerId || 1).then(
        (data) => {
          if (data?.degreeCertificates) {
            setDegreeCertificates(data.degreeCertificates)
            setTableData(data.degreeCertificates)
          }
          if (data?.count) {
            setCount(data.count)
          }
        },
      )
    }
  }

  const handleUpdateRow = (row: IDegreeCertificate) => {
    toggleIsClosed(row).then((data) => {
      if (data) {
        setDegreeCertificates(
          degreeCertificates?.map((degree) =>
            degree.id === data.id ? (data as DegreeCertificateModel) : degree,
          ),
        )
        setTableData(
          degreeCertificates.map((degree) =>
            degree.id === data.id ? (data as DegreeCertificateModel) : degree,
          ),
        )
      }
    })
  }

  const handleGenerateDocument = async (row: DegreeCertificateModel) => {
    await generateDocument(row.id as number).then((data) => {
      if (data) {
        setDegreeCertificates(
          degreeCertificates.map((degree) =>
            degree.id === data.id ? (data as DegreeCertificateModel) : degree,
          ),
        )
        setTableData(
          degreeCertificates.map((degree) =>
            degree.id === data.id ? (data as DegreeCertificateModel) : degree,
          ),
        )
        if (data.certificateDriveId) {
          router.push(`${pathname}/${row.id}/view/${data.certificateDriveId}`)
        }
      }
    })
  }

  const handleGenerateNumeration = async () => {
    await generateNumeration(filters.careerId || 1)
    await loadData()
  }

  const handleSearch = (filters: IDegreeCertificateFilters) => {
    if (filters.isReport === false) return
    getReports(
      filters.isEnd || false,
      filters as IDegreeCertificateFilters,
    ).then((data) => {
      if (data?.degreeCertificates.length > 0) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
        if (data?.count) {
          setCount(data.count)
        }
        return
      }
      setDegreeCertificates([])
      setTableData([])
      setCount(0)
      return
    })
  }

  const handleDownload = async (filters: IDegreeCertificateFilters) => {
    await downloadReport(filters.isEnd || false, filters).then((data) => {
      const { file, fileName } = data
      const byteCharacters = atob(file)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData(
        table.rowsPerPage,
        table.page,
        filters.careerId || 1,
      )
      if (data?.degreeCertificates) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
        setCount(data.count)
        setFirstCharge(false)
        setPrevCareer(filters.careerId || 1)
      }
    } catch (error) {}
  }, [table.rowsPerPage, table.page, filters.careerId])

  const loadReportData = useCallback(async () => {
    try {
      const data = await getReports(
        filters.isEnd || false,
        filters as IDegreeCertificateFilters,
      )
      if (data?.degreeCertificates) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
        setCount(data.count)
        setFirstCharge(false)
        setPrevCareer(filters.careerId || 1)
      }
    } catch (error) {}
  }, [filters])

  useEffect(() => {
    let isMounted = true

    if (
      isMounted &&
      (filters.careerId !== prevCareer || firstCharge) &&
      filters.isReport === false
    ) {
      loadData()
    } else if (filters.isReport === true) {
      loadReportData()
    }

    return () => {
      isMounted = false
    }
  }, [filters.careerId, filters.isReport, table.page, table.rowsPerPage])

  return {
    count,
    tableData,
    loader,
    councils: degreeCertificates,
    router,
    pathname,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleGenerateDocument,
    handleGenerateNumeration,
    handleSearch,
    handleDownload,
    filters,
    setFilters,
  }
}
