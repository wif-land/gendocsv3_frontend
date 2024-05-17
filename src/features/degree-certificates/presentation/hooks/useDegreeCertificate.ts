import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegreeCertificateMethods'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  table: TableProps
  isDataFiltered: boolean
  visitedPages: number[]
  setVisitedPages: (value: number[]) => void
  filters: IDegreeCertificateFilters
}

export const useDegreeCertificateView = ({
  table,
  visitedPages,
  setVisitedPages,
  filters,
}: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])
  const [firstCharge, setFirstCharge] = useState<boolean>(true)
  const [prevCareer, setPrevCareer] = useState<number>(1)
  const [count, setCount] = useState(0)
  const { degreeCertificates, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, generateDocument, generateNumeration } =
    useDegreeCertificateMethods()

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const data = await fetchData(
          table.rowsPerPage,
          table.page,
          filters.career || 1,
        )
        if (isMounted && data?.degreeCertificates) {
          setDegreeCertificates(data.degreeCertificates)
          setTableData(data.degreeCertificates)
          setCount(data.count)
          setFirstCharge(false)
          setPrevCareer(filters.career || 1)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (isMounted && (filters.career !== prevCareer || firstCharge)) {
      loadData()
    }

    return () => {
      isMounted = false
    }
  }, [filters, table.page, table.rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    table.setPage(newPage)

    if (visitedPages.includes(newPage)) {
      return
    } else {
      setVisitedPages([...visitedPages, newPage])
    }

    fetchData(table.rowsPerPage, newPage, filters.career || 1).then((data) => {
      if (data?.degreeCertificates) {
        setDegreeCertificates([
          ...degreeCertificates,
          ...data.degreeCertificates,
        ])
        setTableData([...degreeCertificates, ...data.degreeCertificates])
      }
    })
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    table.onChangeRowsPerPage(event)
    table.setPage(0)
    setTableData([])
    setVisitedPages([])

    fetchData(newRowsPerPage, 0, filters.career || 1).then((data) => {
      if (data?.degreeCertificates) {
        setDegreeCertificates(data.degreeCertificates)
        setTableData(data.degreeCertificates)
      }
      if (data?.count) {
        setCount(data.count)
      }
    })
  }

  const handleUpdateRow = (row: IDegreeCertificate) => {
    updateRow(row).then((data) => {
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

  const handleGenerateNumeration = () => {
    generateNumeration(filters.career || 1)
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
  }
}
