/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useState } from 'react'
import { useCouncilView } from '../hooks/useCouncilView'
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
  useTable,
} from '../../../../shared/sdk/table'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { CouncilTableRow } from '../components/CouncilTableRow'
import { CouncilTableFiltersResult } from '../components/CouncilTableFiltersResult'
import { TABLE_HEAD, defaultFilters } from '../constants'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { useCouncilsMethods } from '../hooks/useCouncilsMethods'

const CouncilListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
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

  const handleDocumentActions = (id: number) => {
    router.push(`${pathname}/${id}/record`)
  }

  const {
    loader,
    tableData,
    count,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    compilationTemplateDriveId,
    separatorTemplateDriveId,
  } = useCouncilView({
    table,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters: filters as ICouncilFilters,
    moduleId,
  })
  const { updateRow } = useCouncilsMethods()

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && count === 0) ||
    (!loader.length && count === 0 && isDataFiltered)

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
            <>
              <Stack
                sx={{
                  display: { xs: 'none', md: 'flex', flexDirection: 'row' },
                  gap: 1.5,
                }}
              >
                <Button
                  component={RouterLink}
                  href={`${pathname}/numeration`}
                  variant="contained"
                  startIcon={<Iconify icon="f7:number" />}
                >
                  Gestionar numeración
                </Button>
                <Button
                  component={RouterLink}
                  href={`${pathname}/view/${separatorTemplateDriveId}`}
                  variant="contained"
                  startIcon={<Iconify icon="solar:document-bold" />}
                >
                  Plantilla separador
                </Button>
                <Button
                  component={RouterLink}
                  href={`${pathname}/view/${compilationTemplateDriveId}`}
                  variant="contained"
                  startIcon={<Iconify icon="solar:document-bold" />}
                >
                  Plantilla acta
                </Button>
                <Button
                  component={RouterLink}
                  href={`${pathname}/new`}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Nuevo consejo
                </Button>
              </Stack>
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CouncilTableToolbar
            isDataFiltered={isDataFiltered}
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredCouncils={handleSearch}
          />

          {isDataFiltered && (
            <CouncilTableFiltersResult
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
                  isMultiSelect={false}
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
                            onDeleteRow={() => {
                              updateRow({
                                isActive: !row.isActive,
                                id: row.id!,
                              }).then(() => setTableData([]))
                            }}
                            onEditRow={() => handleEditRow(row.id!.toString())}
                            onViewRow={() => handleViewRow(row.id!.toString())}
                            onDocumentAction={handleDocumentActions}
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
        title="Cambiar estado de consejos"
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

export default memo(CouncilListView)
