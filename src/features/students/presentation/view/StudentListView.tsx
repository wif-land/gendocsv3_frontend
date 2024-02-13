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
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import Iconify from '../../../../core/iconify'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { RouterLink } from '../../../../core/routes/components'
import {
  IStudentTableFilterValue,
  IStudentTableFilters,
  StudentTableToolbar,
} from '../components/StudentTableToolbar'
import { TABLE_HEAD } from '../constants'
import { StudentModel } from '../../data/models/StudentModel'
import { useStudentView } from '../hooks/useStudentView'
import { StudentTableRow } from '../components/StudentTableRow'

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
          heading="Funcionarios"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Funcionarios' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo funcionario
            </Button>
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
