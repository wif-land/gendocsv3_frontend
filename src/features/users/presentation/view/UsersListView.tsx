/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from 'next/navigation'
import { ChangeEvent, memo, useCallback, useState } from 'react'
import {
  DENSE,
  NO_DENSE,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  emptyRows,
  useTable,
} from '../../../../shared/sdk/table'
import { useUserView } from '../hooks/useUsersView'
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
import { RouterLink } from '../../../../core/routes/components'
import { UsersTableRow } from '../components/UsersTableRow'
import {
  UsersTableToolbar,
  IUsersTableFilterValue,
  IUsersTableFilters,
} from '../components/UsersTableToolbar'
import { TABLE_HEAD } from '../constants'
import { FunctionaryTableResult } from '../components/UsersTableFiltersResult'
import { IUser } from '../../domain/entities/IUser'

const defaultFilters: IUsersTableFilters = {
  field: undefined,
  state: undefined,
}

const UsersListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const [count, setCount] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)

  const [tableData, setTableData] = useState<IUser[]>([])
  const [filters, setFilters] = useState<IUsersTableFilters>(defaultFilters)

  const handleFilters = useCallback(
    (name: string, value: IUsersTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [table],
  )

  const { loader, handleChangePage, handleUpdateRow, handleSearch } =
    useUserView({
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

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Usuarios"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Usuarios' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo usuario
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <UsersTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            isDataFiltered={isDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredUsers={handleSearch}
          />

          {isDataFiltered && (
            <FunctionaryTableResult
              onResetFilters={handleResetFilters}
              results={count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                          <UsersTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
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
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
              table.onChangeRowsPerPage(e)
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </div>
  )
}
export default memo(UsersListView)
