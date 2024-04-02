/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useEffect, useState } from 'react'
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
import { CareerTableRow } from '../components/CareerTableRow'
import { useCareerView } from '../hooks/useCareerView'
import { CareerModel } from '../../data/models/CareerModel'
import {
  CareerTableToolbar,
  ICareerTableFilterValue,
  ICareerTableFilters,
} from '../components/CareerTableToolbar'
import { CareerTableFiltersResult } from '../components/CareerTableFiltersResult'

const TABLE_HEAD = [
  { id: 'name', label: 'Carrera' },
  { id: 'credits', label: 'Créditos', width: 160 },
  { id: 'internshipHours', label: 'Horas de prácticas', width: 160 },
  { id: 'vinculationHours', label: 'Horas de Vinculación', width: 260 },
  { id: 'isActive', label: 'Estado', width: 100 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

const defaultFilters: ICareerTableFilters = {
  name: undefined,
  state: undefined,
}

const CareerListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()

  const { loader, careers, setCareers } = useCareerView()
  const [isDataFiltered, setIsDataFiltered] = useState(
    undefined as boolean | undefined,
  )

  const [filters, setFilters] = useState<ICareerTableFilters>(defaultFilters)

  const handleFilters = useCallback(
    (name: string, value: ICareerTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const [tableData, setTableData] = useState<CareerModel[]>([])

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  })

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  )

  const denseHeight = table.dense ? 60 : 80

  const canReset = !isEqual(defaultFilters, filters)

  useEffect(() => {
    if (careers?.length) {
      setTableData(careers as CareerModel[])
    }
  }, [careers])

  const confirm = useBoolean()

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id!.toString() !== id)
      setTableData(deleteRow)

      table.onUpdatePageDeleteRow(dataInPage.length)
    },
    [dataInPage.length, table, tableData],
  )

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id!.toString()),
    )
    setTableData(deleteRows)

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    })
  }, [dataFiltered.length, dataInPage.length, table, tableData])

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}/edit`)
    },
    [router],
  )

  const notFound =
    (!dataFiltered.length && canReset) ||
    (!loader.length && !dataFiltered.length)

  const settings = useSettingsContext()

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setIsDataFiltered(false)
    setCareers([])
  }

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Carreras"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Carreras' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nueva carrera
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CareerTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setIsDataFiltered={setIsDataFiltered}
          />

          {isDataFiltered && (
            <CareerTableFiltersResult
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
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
                  rowCount={tableData.length}
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
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage,
                        )
                        .map((row) => (
                          <CareerTableRow
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
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
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
  inputData: CareerModel[]
  comparator: (a: any, b: any) => number
  filters: ICareerTableFilters
}) => {
  let currentInputData = [...inputData]
  const { name, state } = filters

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
      (career) => career.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    )
  }

  if (state !== undefined) {
    currentInputData = currentInputData.filter(
      (career) => career.isActive === state,
    )
  }

  return currentInputData
}

export default memo(CareerListView)
