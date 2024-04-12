/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback } from 'react'
import { useDegreeCertificateView } from '../hooks/useDegreeCertificate'
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs'
import Iconify from '../../../../core/iconify'
import { DegreeCertificatesTableToolbar } from '../components/DegreeCertificateTableToolbar'
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
} from '../../../../shared/sdk/table'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { CouncilTableRow } from '../components/DegreeCertificateTableRow'
import { CouncilTableFiltersResult } from '../components/DegreeCertificateTableFiltersResult'
import { TABLE_HEAD } from '../constants'

export default memo(({ moduleId }: { moduleId: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()

  const {
    table,
    isDataFiltered,
    setSearchTerm,
    setVisitedPages,
    handleFilters,
    filters,
    handleResetFilters,
    setTableData,
    handleSearch,
    tableData,
    handleChangePage,
    handleChangeRowsPerPage,
    count,
    loader,
  } = useDegreeCertificateView(moduleId)

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

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && count === 0) ||
    (!loader.length && count === 0 && isDataFiltered.value)

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Actas de Grado"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Actas de Grado' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nueva Acta
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <DegreeCertificatesTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setSearchTerm={setSearchTerm}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={isDataFiltered.onToggle}
            table={table}
            setDataTable={setTableData}
            getFilteredCouncils={handleSearch}
          />

          {isDataFiltered.value && (
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
                  tableData.map((row) => row.number!.toString()),
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
                  rowCount={count}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.number!.toString()),
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
                          <CouncilTableRow
                            key={row.number}
                            row={row}
                            selected={table.selected.includes(
                              row.number!.toString(),
                            )}
                            onSelectRow={() =>
                              table.onSelectRow(row.number!.toString())
                            }
                            onDeleteRow={() => console.log('deleted')}
                            onEditRow={() =>
                              handleEditRow(row.number!.toString())
                            }
                            onViewRow={() =>
                              handleViewRow(row.number!.toString())
                            }
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
        title="Eliminar Actas de Grado"
        content={
          <>
            ¿Estás seguro de que quieres elimiar
            <strong> {table.selected.length} </strong> items? Esta acción no se
            puede deshacer.
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
            Eliminar
          </Button>
        }
      />
    </div>
  )
})
