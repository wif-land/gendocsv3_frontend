/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useState } from 'react'
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
import { useFunctionaryView } from '../hooks/usePositionView'
import { PositionModel } from '../../data/models/PositionModel'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import Iconify from '../../../../core/iconify'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { RouterLink } from '../../../../core/routes/components'
import { PositionTableRow } from '../components/PositionTableRow'
import {
  FunctionaryTableToolbar,
  IPositionTableFilterValue,
  IPositionTableFilters,
} from '../components/PositionTableToolbar'
import { TABLE_HEAD } from '../constants'
import { FunctionaryTableResult } from '../components/PositionTableFiltersResult'

const defaultFilters: IPositionTableFilters = {
  variable: '',
  name: '',
}

const PositionListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [tableData, setTableData] = useState<PositionModel[]>([])
  const [filters, setFilters] = useState<IPositionTableFilters>(defaultFilters)

  const handleFilters = useCallback(
    (name: string, value: IPositionTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const {
    loader,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleDeleteRow,
    handleDeleteManyRows,
  } = useFunctionaryView({
    tableData,
    setTableData,
    table,
    setCount,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    field: searchTerm,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const confirm = useBoolean()

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}/edit`)
    },
    [router],
  )

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setSearchTerm('')
    setVisitedPages([])
    setIsDataFiltered(false)
    setTableData([])
  }

  const notFound =
    (count === 0 && isDataFiltered) ||
    (!loader.length && count === 0 && isDataFiltered)

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cargos"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Cargos' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo cargo
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <FunctionaryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setSearchTerm={setSearchTerm}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredFunctionaries={handleSearch}
          />

          {isDataFiltered && (
            <FunctionaryTableResult
              onResetFilters={handleResetFilters}
              results={count}
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
                <Button color="primary" onClick={confirm.onTrue}>
                  Eliminar
                </Button>
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
                      {tableData
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage,
                        )
                        .map((row) => (
                          <PositionTableRow
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
        title="Actualizar estado"
        content={
          <>
            Estás seguro que desear eliminar el estado de{' '}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteManyRows()
              confirm.onFalse()
            }}
          >
            Eliminar
          </Button>
        }
      />
    </div>
  )
}
export default memo(PositionListView)
