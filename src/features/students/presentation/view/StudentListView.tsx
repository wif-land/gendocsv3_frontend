/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useState } from 'react'
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
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import {
  Button,
  Card,
  Container,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
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
import { StudentModel } from '../../data/models/StudentModel'
import { useStudentView } from '../hooks/useStudentView'
import { StudentTableRow } from '../components/StudentTableRow'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import { StudentBulkUploadDialog } from '../components/StudentBulkUploadDialog'
import LoadingButton from '@mui/lab/LoadingButton'

const defaultFilters: IStudentTableFilters = {
  name: '',
  personalEmail: '',
  outlookEmail: '',
}

const StudentListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const { loader, students } = useStudentView()
  const upload = useBoolean()
  const popover = usePopover()

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

  const [tableData, setTableData] = useState<StudentModel[]>([])
  const [filters, setFilters] = useState<IStudentTableFilters>(defaultFilters)

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
    if (students?.length) {
      setTableData(students as StudentModel[])
    }
  }, [students])

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
          <StudentTableToolbar filters={filters} onFilters={handleFilters} />
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
                <Tooltip title="Borrar">
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
                          <StudentTableRow
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
        title="Borrar"
        content={
          <>
            Estás seguro que desear eliminar{' '}
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
  inputData: StudentModel[]
  comparator: (a: any, b: any) => number
  filters: IStudentTableFilters
}) => {
  let currentInputData = [...inputData]
  const { name } = filters

  const stabilizedThis = currentInputData.map(
    (el, index) =>
      [
        {
          ...el,
          name: `${el.firstName} ${el.secondName} ${el.firstLastName} ${el.secondLastName}`,
        },
        index,
      ] as const,
  )

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  currentInputData = stabilizedThis.map((el) => StudentModel.fromJson(el[0]))

  if (name) {
    currentInputData = currentInputData.filter(
      (student) =>
        student.firstName.toLowerCase().includes(name.toLowerCase()) ||
        student.secondName.toLowerCase().includes(name.toLowerCase()) ||
        student.firstLastName.toLowerCase().includes(name.toLowerCase()) ||
        student.secondLastName.toLowerCase().includes(name.toLowerCase()),
    )
  }

  return currentInputData
}

export default memo(StudentListView)
