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
import { useFunctionaryView } from '../hooks/useFunctionaryView'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import {
  Button,
  Card,
  Container,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import Iconify from '../../../../core/iconify'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { FunctionaryTableRow } from '../components/FunctionaryTableRow'
import {
  FunctionaryTableToolbar,
  IFunctionaryTableFilterValue,
  IFunctionaryTableFilters,
} from '../components/FunctionaryTableToolbar'
import { TABLE_HEAD } from '../constants'
import { FunctionaryTableResult } from '../components/FunctionaryTableFiltersResult'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import LoadingButton from '@mui/lab/LoadingButton'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { FuntionaryBulkUploadDialog } from '../components/FunctionaryBulkUploadDialog'

const defaultFilters: IFunctionaryTableFilters = {
  field: undefined,
  state: undefined,
}

const FunctionaryListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)

  const [tableData, setTableData] = useState<FunctionaryModel[]>([])
  const [filters, setFilters] =
    useState<IFunctionaryTableFilters>(defaultFilters)
  const popover = usePopover()
  const bulk = useBoolean()

  const handleFilters = useCallback(
    (name: string, value: IFunctionaryTableFilterValue) => {
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
    handleUpdateRow,
    handleUpdateRows,
    handleSearch,
  } = useFunctionaryView({
    tableData,
    setTableData,
    table,
    setCount,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters,
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
    setVisitedPages([])
    setIsDataFiltered(false)
    setTableData([])
  }

  const notFound =
    (count === 0 && isDataFiltered) ||
    (!loader.length && count === 0 && isDataFiltered)

  const createActions = [
    {
      value: 'single',
      label: 'Individual',
      action: () => router.push(`${pathname}/new`),
    },
    {
      value: 'multiple',
      label: 'Varios',
      action: bulk.onTrue,
    },
  ]

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Funcionarios"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Funcionarios' },
          ]}
          action={
            // <Button
            //   component={RouterLink}
            //   href={`${pathname}/new`}
            //   variant="contained"
            //   startIcon={<Iconify icon="mingcute:add-line" />}
            // >
            //   Nuevo funcionario
            // </Button>

            <LoadingButton
              color="inherit"
              variant="contained"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={popover.onOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              Agregar
            </LoadingButton>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <FunctionaryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            isDataFiltered={isDataFiltered}
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
                  Cambiar estado
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
                          <FunctionaryTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
                            onSelectRow={() =>
                              table.onSelectRow(row.id!.toString())
                            }
                            onDeleteRow={() => handleUpdateRow(row)}
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

      <FuntionaryBulkUploadDialog open={bulk.value} onClose={bulk.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {createActions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              popover.onClose()
              option.action()
            }}
          >
            {option.value === 'multiple' && (
              <Iconify icon="eva:cloud-upload-fill" />
            )}
            {option.value === 'single' && (
              <Iconify icon="solar:file-text-bold" />
            )}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Actualizar estado"
        content={
          <>
            Estás seguro que desear actualizar el estado de{' '}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleUpdateRows()
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
export default memo(FunctionaryListView)
