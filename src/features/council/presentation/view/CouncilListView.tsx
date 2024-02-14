/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilView } from '../hooks/useCouncilView'
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs'
import Iconify from '../../../../core/iconify'
import {
  CouncilTableToolbar,
  ICouncilTableFilterValue,
  ICouncilTableFilters,
} from '../components/CouncilTableToolbar'
import {
  DENSE,
  NO_DENSE,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  emptyRows,
  useTable,
} from '../../../../shared/sdk/table'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { CouncilTableRow } from '../components/CouncilTableRow'
import { CouncilTableFiltersResult } from '../components/CouncilTableFiltersResult'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

const TABLE_HEAD = [
  { id: 'name', label: 'Consejo' },
  { id: 'createdAt', label: 'Hora de ejecución', width: 160 },
  { id: 'date', label: 'Fecha de ejecución', width: 260 },
  { id: 'isActive', label: 'Estado', width: 140 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

const defaultFilters: ICouncilTableFilters = {
  name: '',
}

const CouncilListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()

  const {
    loader,
    councils,
    setCouncils,
    fetchData,
    moduleIdentifier,
    updateRow,
    fetchFilteredData,
  } = useCouncilView({
    moduleId,
  })

  const [currentPage, setCurrentPage] = useState(0)
  // eslint-disable-next-line no-magic-numbers
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [filteredCouncils, setFilteredCouncils] = useState<CouncilModel[]>([])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const [filters, setFilters] = useState<ICouncilTableFilters>(defaultFilters)
  const [tableData, setTableData] = useState<CouncilModel[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleResetFilters = () => {
    setSearchTerm('')
    setIsDataFiltered(false)
    setTableData([])
  }

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!filteredCouncils.length && isDataFiltered) ||
    (!loader.length && !filteredCouncils.length && isDataFiltered) ||
    !councils.length

  const handleFilters = useCallback(
    (name: string, value: ICouncilTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const handleDeleteRow = useCallback(
    (row: CouncilModel) => {
      updateRow(row).then((council) => {
        if (council) {
          const updatedTableData = tableData.map((row) =>
            row.id === council.id ? council : row,
          )
          setCouncils(updatedTableData)
          setTableData(updatedTableData)
        }
      })
    },
    [table, tableData],
  )

  const handleDeleteRows = useCallback(async () => {
    const deleteRows = tableData.filter((row) =>
      table.selected.includes(row.id!.toString()),
    )

    const { councils, status } =
      await CouncilsUseCasesImpl.getInstance().toggleCouncilStatus(
        deleteRows.map((row) => ({
          isActive: !row.isActive,
          id: row.id,
        })),
      )

    if (status === HTTP_STATUS_CODES.OK) {
      const updatedTableData = tableData.map(
        (row) => councils.find((council) => council.id === row.id) || row,
      )
      setCouncils(updatedTableData)
      setTableData(updatedTableData)
    }
  }, [table, tableData])

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

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    setCurrentPage(newPage)
    if (!visitedPages.includes(newPage)) {
      setVisitedPages([...visitedPages, newPage])
    }

    if (visitedPages.includes(newPage)) return

    if (newPage > currentPage) {
      if (isDataFiltered) {
        if (count === filteredCouncils.length) return
        fetchFilteredData(rowsPerPage, newPage, filters.name).then((data) => {
          if (data?.councils) {
            setCouncils([...councils, ...data.councils])
            setTableData([...tableData, ...data.councils])
          }
        })
      } else {
        if (count === councils.length) return
        fetchData(rowsPerPage, newPage).then((data) => {
          if (data?.councils) {
            setCouncils([...councils, ...data.councils])
            setTableData([...tableData, ...data.councils])
          }
        })
      }
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    table.onChangeRowsPerPage(event)
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setVisitedPages([])
    setTableData([])
    if (isDataFiltered) {
      fetchFilteredData(Number(event.target.value), 0, filters.name).then(
        (data) => {
          if (data?.councils) {
            setTableData(data.councils)
            setCouncils(data.councils)
          }
          if (data?.count) {
            setCount(data.count)
          }
        },
      )
    } else {
      fetchData(Number(event.target.value), 0).then((data) => {
        if (data?.councils) {
          setTableData(data.councils)
          setCouncils(data.councils)
        }
        if (data?.count) {
          setCount(data.count)
        }
      })
    }
  }

  useEffect(() => {
    let isMounted = true

    if (tableData.length === 0 && !isDataFiltered) {
      if (isMounted) {
        fetchData(rowsPerPage, currentPage).then((data) => {
          if (data?.councils && data?.councils.length > 0) {
            setTableData(data?.councils)
            setCouncils(data?.councils)
          }
          if (data?.count) {
            setCount(data.count)
          }
        })
      }
    }

    return () => {
      isMounted = false
    }
  }, [moduleId, tableData, count, isDataFiltered])

  useEffect(() => {
    if (councils !== null && councils.length) {
      setTableData(councils)
    }
  }, [councils])

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Consejos"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Consejos' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo consejo
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CouncilTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setFilteredCouncils={setFilteredCouncils}
            moduleId={moduleIdentifier}
            setDataTable={setTableData}
            setIsDataFiltered={setIsDataFiltered}
            setVisitedPages={setVisitedPages}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setCount={setCount}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {isDataFiltered && (
            <CouncilTableFiltersResult
              onResetFilters={handleResetFilters}
              results={filteredCouncils !== null ? count : 0}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={
                !isDataFiltered ? tableData.length : filteredCouncils.length
              }
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id!.toString()),
                )
              }
              action={
                <Tooltip title="Delete">
                  <Button color="primary" onClick={confirm.onTrue}>
                    <Typography
                      variant="button"
                      sx={{
                        ml: 2,
                        flexGrow: 1,
                        color: 'primary.main',
                      }}
                    >
                      Cambiar estado
                    </Typography>
                  </Button>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={count}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id!.toString()),
                    )
                  }
                />

                <TableBody>
                  {loader.length ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage,
                        )
                        .map((row) => (
                          <CouncilTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
                            onSelectRow={() =>
                              table.onSelectRow(row.id!.toString())
                            }
                            onDeleteRow={() => handleDeleteRow(row)}
                            onEditRow={() => handleEditRow(row.id!.toString())}
                            onViewRow={() => handleViewRow(row.id!.toString())}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, count)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cambiar estado de consejos"
        content={
          <>
            Estás seguro de que quieres cambiar el estado de
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows()
              confirm.onFalse()
            }}
          >
            Cambiar
          </Button>
        }
      />
    </div>
  )
}

export default memo(CouncilListView)
