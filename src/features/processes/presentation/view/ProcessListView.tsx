/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useState } from 'react'
import { useProcessView } from '../hooks/useProcessView'
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
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
  useTable,
} from '../../../../shared/sdk/table'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { ProcessTableRow } from '../components/ProcessTableRow'

import {
  IProcessTableFilters,
  IProcessTableFilterValue,
  ProcessTableToolbar,
} from '../components/ProcessTableToolbar'
import { defaultFilters, TABLE_HEAD } from '../constants'
import { ProcessTableFiltersResult } from '../components/ProcessTableFiltersResult'

const ProcessListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)

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

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setVisitedPages([])
    setIsDataFiltered(false)
    setTableData([])
  }

  const {
    loader,
    tableData,
    count,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleUpdateRow,
    defaultTemplate,
  } = useProcessView({
    table,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters,
    moduleId,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && count === 0) ||
    (!loader.length && count === 0 && isDataFiltered) ||
    !tableData

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
            <>
              <Stack
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <Button
                  component={RouterLink}
                  href={`${pathname}/view/${defaultTemplate}`}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Plantilla por defecto
                </Button>
                <Button
                  component={RouterLink}
                  href={`${pathname}/new`}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Nuevo proceso
                </Button>
              </Stack>
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProcessTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            isDataFiltered={isDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredProcesss={handleSearch}
          />

          {isDataFiltered && (
            <ProcessTableFiltersResult
              onResetFilters={handleResetFilters}
              results={count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={count}
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
                  {loader.length
                    ? [...Array(table.rowsPerPage)].map((i, index) => (
                        <TableSkeleton
                          key={index}
                          sx={{ height: denseHeight }}
                        />
                      ))
                    : tableData !== undefined &&
                      tableData
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
                            onDeleteRow={() => handleUpdateRow(row)}
                            onEditRow={() => handleEditRow(row.id!.toString())}
                            onViewRow={() => handleViewRow(row.id!.toString())}
                          />
                        ))}

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
            count={count || 0}
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
        title="Cambiar estado de procesos"
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
              // handleDeleteRows()
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

export default memo(ProcessListView)
