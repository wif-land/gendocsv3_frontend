/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { isEqual } from 'lodash'

import { memo, useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { ProcessModel } from '../../data/models/ProcessesModel'

import {
  ProcessTableToolbar,
  IProcessTableFilterValue,
  IProcessTableFilters,
} from '../components/ProcessTableTooldar'
import { useProcessView } from '../hooks/useProcessView'
import { ProcessTableRow } from '../components/ProcessTableRow'

const TABLE_HEAD = [
  { id: 'name', label: 'Proceso' },
  { id: 'isActive', label: 'Estado', width: 100 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

const defaultFilters: IProcessTableFilters = {
  name: '',
}

const ProcessListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()

  const { loader, processes } = useProcessView({ moduleId })

  const [filters, setFilters] = useState<IProcessTableFilters>(defaultFilters)

  const handleFilters = useCallback(
    (name: string, value: IProcessTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const [tableData, setTableData] = useState<ProcessModel[]>([])

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

  useEffect(() => {
    if (processes?.length) {
      setTableData(processes as ProcessModel[])
    }
  }, [processes])

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

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Procesos"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Procesos' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo proceso
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProcessTableToolbar filters={filters} onFilters={handleFilters} />
          {/*
          {canReset && (
            <ProductTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={0}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

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
                          <ProcessTableRow
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
            Estás seguro que desear borrar{' '}
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
            Borrar
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
  inputData: ProcessModel[]
  comparator: (a: any, b: any) => number
  filters: IProcessTableFilters
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
      (product) =>
        product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    )
  }

  return currentInputData
}

export default memo(ProcessListView)
