/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilView } from '../hooks/useCouncilView'
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
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
  getComparator,
  useTable,
} from '../../../../shared/sdk/table'
import { isEqual } from 'lodash'
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

  const {
    loader,
    councils,
    setCouncils,
    fetchInitialData,
    moduleIdentifier,
    fetchCount,
    fetchNextPage,
  } = useCouncilView({
    moduleId,
  })

  const [filters, setFilters] = useState<ICouncilTableFilters>(defaultFilters)

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

  const [tableData, setTableData] = useState<CouncilModel[]>([])

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

  const canReset = !isEqual(defaultFilters, filters)

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const confirm = useBoolean()
  useEffect(() => {
    if (councils !== null && councils.length) {
      setTableData(councils)
    }
  }, [councils])

  const findOne = async (id: string) => {
    const council = await CouncilsUseCasesImpl.getInstance().getByTerm(
      id,
      moduleIdentifier,
    )
    return council
  }

  const handleDeleteRow = useCallback(
    async (id: string) => {
      let currentCouncil = councils.find((row) => row.id === +id)

      if (!currentCouncil) {
        const result = await findOne(id)

        if (result.status === HTTP_STATUS_CODES.OK) {
          const { council } = result
          currentCouncil = council[0]
        }
      }

      if (currentCouncil) {
        const { council } = await CouncilsUseCasesImpl.getInstance().update(
          +id,
          {
            isActive: !currentCouncil.isActive,
          },
        )
        const updatedTableData = tableData.map((row) =>
          row.id === council.id ? council : row,
        )
        setCouncils(updatedTableData)
        setTableData(updatedTableData)
      }
    },
    [dataInPage.length, table, tableData],
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

  const notFound =
    (!dataFiltered.length && canReset) ||
    (!loader.length && !dataFiltered.length)

  const settings = useSettingsContext()

  const [currentPage, setCurrentPage] = useState(0)
  // eslint-disable-next-line no-magic-numbers
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [filteredCouncils, setFilteredCouncils] = useState<CouncilModel[]>([])
  const [isDataFiltered, setIsDataFiltered] = useState(false)

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage)
    setCurrentPage(newPage)
    if (!visitedPages.includes(newPage)) {
      setVisitedPages([...visitedPages, newPage])
    }

    if (isDataFiltered) return

    if (visitedPages.includes(newPage)) return

    if (count === councils.length) return

    if (newPage > currentPage) {
      fetchNextPage(rowsPerPage, newPage).then(() => {
        setTableData(councils)
      })
    }
  }

  const handleChangeRowsPerPage = (
    evento: React.ChangeEvent<HTMLInputElement>,
  ) => {
    table.onChangeRowsPerPage(evento)
    setRowsPerPage(Number(evento.target.value))
    setCurrentPage(0)
    setVisitedPages([])
    setTableData([])
    const fetchOnRowChange = async () => {
      await CouncilsUseCasesImpl.getInstance()
        .getAllCouncilsByModuleId(
          moduleIdentifier,
          Number(evento.target.value),
          0,
        )
        .then((response) => {
          setCouncils(response.councils)
          setTableData(response.councils)
        })
    }
    fetchOnRowChange()
  }

  useEffect(() => {
    let isMounted = true

    if (tableData.length === 0) {
      if (isMounted) {
        fetchInitialData(rowsPerPage, currentPage).then((response) => {
          if (response.length > 0) {
            setTableData(response)
          }
        })
      }
    }

    if (count === 0) {
      if (isMounted) {
        fetchCount().then((response) => {
          setCount(response)
        })
      }
    }
    return () => {
      isMounted = false
    }
  }, [moduleId, tableData.length, count])

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
          />

          {canReset && (
            <CouncilTableFiltersResult
              councils={filteredCouncils}
              handleDeleteRow={handleDeleteRow}
              handleEditRow={handleEditRow}
              handleViewRow={handleViewRow}
              table={table}
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={filteredCouncils !== null ? filteredCouncils.length : 0}
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
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
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
                  rowCount={
                    !isDataFiltered ? tableData.length : filteredCouncils.length
                  }
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
                            onDeleteRow={() =>
                              handleDeleteRow(row.id!.toString())
                            }
                            onEditRow={() => handleEditRow(row.id!.toString())}
                            onViewRow={() => handleViewRow(row.id!.toString())}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData.length,
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={!isDataFiltered ? count : filteredCouncils.length}
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
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
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
            Delete
          </Button>
        }
      />
    </div>
  )
}

const applyFilter = ({
  inputData,
  comparator,
  filters,
}: {
  inputData: CouncilModel[]
  comparator: (a: any, b: any) => number
  filters: ICouncilTableFilters
}) => {
  let currentInputData = [...inputData]
  const { name } = filters

  const stabilizedThis = currentInputData.map(
    (el, index) => [el, index] as const,
  )

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  currentInputData = stabilizedThis.map((el) => el[0])

  if (name) {
    currentInputData = currentInputData.filter(
      (council) =>
        council.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    )
  }

  return currentInputData
}

export default memo(CouncilListView)
