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
import {
  IStudentTableFilterValue,
  IStudentTableFilters,
  StudentTableToolbar,
} from '../components/StudentTableToolbar'
import { TABLE_HEAD } from '../constants'
import { useStudentView } from '../hooks/useStudentView'
import { StudentTableRow } from '../components/StudentTableRow'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentBulkUploadDialog } from '../components/StudentBulkUploadDialog'
import LoadingButton from '@mui/lab/LoadingButton'
import { StudentTableResult } from '../components/StudentTableFiltersResult'
import { IStudentFilters } from '../../domain/entities/IStudentFilters'

const defaultFilters: IStudentTableFilters = {
  field: undefined,
  state: undefined,
}

const StudentListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const [filters, setFilters] = useState<IStudentTableFilters>(defaultFilters)
  const upload = useBoolean()
  const popover = usePopover()

  const handleFilters = useCallback(
    (name: string, value: IStudentTableFilterValue) => {
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
    tableData,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleUpdateRows,
    handleSearch,
  } = useStudentView({
    table,
    setCount,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters: filters as IStudentFilters,
  })

  const createActions = [
    {
      value: 'single',
      label: 'Individual',
      action: () => router.push(`${pathname}/new`),
    },
    {
      value: 'multiple',
      label: 'Varios',
      action: upload.onTrue,
    },
  ]

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const confirm = useBoolean()

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}/edit`)
    },
    [router],
  )

  const handleResetFilters = () => {
    setIsDataFiltered(false)
    setFilters(defaultFilters)
    setVisitedPages([])
    setTableData([])
    console.log('reset filters')
  }

  const notFound =
    (count === 0 && isDataFiltered) ||
    (!loader.length && count === 0 && isDataFiltered)

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Estudiantes"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Estudiantes' },
          ]}
          action={
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
          <StudentTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            isDataFiltered={isDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredStudents={handleSearch}
          />

          {isDataFiltered && (
            <StudentTableResult
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
                          <StudentTableRow
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

      <StudentBulkUploadDialog open={upload.value} onClose={upload.onFalse} />

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
        title="Cambiar estado"
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

export default memo(StudentListView)
