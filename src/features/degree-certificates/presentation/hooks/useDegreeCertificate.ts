import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useCallback, useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IDegreeCertificateTableFilters } from '../components/DegreeTableToolbar'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { defaultFilters } from '../constants'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'
import { UserRole } from '../../../../features/users/domain/entities/IUser'

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
  const searchParams = useSearchParams()
  const { user } = useAccountStore()

  const getCareerDefaultId = () => {
    if (user?.accessCareersDegCert && user.accessCareersDegCert.length > 0) {
      return user.accessCareersDegCert[0]
    }

    return 1
  }

  const [filters, setFilters] = useState<IDegreeCertificateTableFilters>(
    defaultFilters(searchParams, getCareerDefaultId()),
  )
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])
  const [firstCharge, setFirstCharge] = useState<boolean>(true)
  const [prevCareer, setPrevCareer] = useState<number>(1)
  const [count, setCount] = useState(0)
  const { degreeCertificates, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()
  const {
    fetchData,
    toggleIsClosed,
    generateDocument,
    generateNumeration,
    deleteDegreeCertificate,
    getReports,
    downloadReport,
  } = useDegreeCertificateMethods()

  const getCareerId = () => {
    if (user?.role === UserRole.ADMIN) {
      return filters.careerId || 1
    }

    if (user?.accessCareersDegCert && user.accessCareersDegCert.length > 0) {
      return filters.careerId || user.accessCareersDegCert[0]
    }

    return 1
  }

  const deleteReportParam = () => {
    const params = new URLSearchParams(searchParams as unknown as string)

    if (searchParams.has('isReport')) params.set('isReport', 'false')
  }

  useEffect(() => {
    if (searchParams.has('careerId')) {
      setFilters({
        ...filters,
        careerId: parseInt(searchParams.get('careerId') as string),
      })
    }

    if (searchParams.has('isEnd')) {
      setFilters({
        ...filters,
        isEnd: searchParams.get('isEnd') === 'true',
      })
    }

    if (searchParams.has('isReport')) {
      setFilters({
        ...filters,
        isReport: searchParams.get('isReport') === 'false',
      })
    }

    if (searchParams.has('startDate')) {
      setFilters({
        ...filters,
        startDate: new Date(searchParams.get('startDate') as string),
      })
    }

    if (searchParams.has('endDate')) {
      setFilters({
        ...filters,
        endDate: new Date(searchParams.get('endDate') as string),
      })
    }

    if (searchParams.has('field')) {
      setFilters({
        ...filters,
        field: searchParams.get('field') as string,
      })
    }

    if (searchParams.has('order')) {
      setFilters({
        ...filters,
        order: searchParams.get('order') as 'ASC' | 'DESC',
      })
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const params = new URLSearchParams(searchParams as unknown as string)

    if (filters.careerId) {
      params.set('careerId', filters.careerId.toString())
    }

    if (filters.isEnd) {
      params.set('isEnd', filters.isEnd.toString())
    }

    if (filters.isReport) {
      params.set('isReport', filters.isReport.toString())
    }

    if (filters.startDate) {
      params.set('startDate', filters.startDate.toISOString())
    }

    if (filters.endDate) {
      params.set('endDate', filters.endDate.toISOString())
    }

    if (filters.field) {
      params.set('field', filters.field)
    }

    if (filters.order) {
      params.set('order', filters.order)
    }

    router.replace(`${pathname}?${params.toString()}`)

    const loadData = async () => {
      addLoaderItem('degree-certificates')
      try {
        const data = await fetchData(
          table.rowsPerPage,
          table.page,
          filters as IDegreeCertificateFilters,
        )
        if (isMounted && data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          setFirstCharge(false)
          setPrevCareer(getCareerId())
          removeLoaderItem('degree-certificates')
        }
      } catch (error) {}
    }

    const loadReportData = async () => {
      try {
        addLoaderItem('degree-certificates')
        const data = await getReports(
          filters.isEnd || false,
          filters as IDegreeCertificateFilters,
        )
        if (isMounted && data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          setFirstCharge(false)
          setPrevCareer(getCareerId())
          removeLoaderItem('degree-certificates')
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
        fetchData(
          table.rowsPerPage,
          newPage,
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
      }
    }
  }

  const handleChangeRowsPerPage = () => {
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
      fetchData(
        table.rowsPerPage,
        table.page,
        filters as IDegreeCertificateFilters,
      ).then((data) => {
        if (data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
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

  const handleDeleteRow = (row: IDegreeCertificate) => {
    deleteDegreeCertificate(row.id as number).then((data) => {
      if (data) {
        setDegreeCertificates(
          degreeCertificates.filter((degree) => degree.id !== row.id),
        )
        setTableData(
          degreeCertificates.filter((degree) => degree.id !== row.id),
        )
      }
    })
  }

  const handleGenerateDocument = async (row: DegreeCertificateModel) => {
    addLoaderItem('degree-certificates')
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
    removeLoaderItem('degree-certificates')
  }

  const handleGenerateNumeration = async () => {
    await generateNumeration(getCareerId())

    table.setPage(0)
    setVisitedPages([])
    setTableData([])
    setFirstCharge(true)

    loadData()
  }

  const handleSearch = (filters: IDegreeCertificateFilters) => {
    if (filters.isReport === false) {
      fetchData(table.rowsPerPage, table.page, filters).then((data) => {
        if (data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          return
        }
        setDegreeCertificates([])
        setTableData([])
        setCount(0)
        return
      })
      return
    }
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

  const loadData = async () => {
    try {
      const data = await fetchData(
        table.rowsPerPage,
        table.page,
        filters as IDegreeCertificateFilters,
      )
      if (data?.degreeCertificates) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
        setCount(data.count)
        setFirstCharge(false)
        setPrevCareer(getCareerId())
      }
    } catch (error) {
      console.error(error)
    }
  }

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
        setPrevCareer(getCareerId())
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

  useEffect(() => {
    handleChangeRowsPerPage()
  }, [table.rowsPerPage])

  const updateOrderParam = (order: 'ASC' | 'DESC') => {
    const params = new URLSearchParams(searchParams as unknown as string)
    params.set('order', order)
    router.replace(`${pathname}?${params.toString()}`)
  }

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
    handleDeleteRow,
    handleSearch,
    searchParams,
    handleDownload,
    filters,
    setFilters,
    deleteReportParam,
    updateOrderParam,
  }
}
