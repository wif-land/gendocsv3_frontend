/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useState } from 'react'
import {
  Button,
  Card,
  Container,
  MenuItem,
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
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { TABLE_HEAD, defaultFilters } from '../constants'
import { useDegreeCertificateView } from '../hooks/useDegreeCertificate'
import {
  DegreeCertificatesTableToolbar,
  IDegreeCertificateTableFilterValue,
  IDegreeCertificateTableFilters,
} from '../components/DegreeCertificateTableToolbar'
import { DegreeCertificateTableRow } from '../components/DegreeCertificateTableRow'
import CustomPopover, {
  usePopover,
} from '../../../../shared/sdk/custom-popover'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'

const DegreeCertificateListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const popover = usePopover()
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const [filters, setFilters] =
    useState<IDegreeCertificateTableFilters>(defaultFilters)

  const {
    loader,
    tableData,
    count,
    router,
    pathname,
    setTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateRow,
    handleGenerateDocument,
    handleGenerateNumeration,
  } = useDegreeCertificateView({
    table,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters,
  })

  const reportOptions = [
    {
      value: 'start',
      label: 'Reporte inicial',
      action: () => {
        router.push(`${pathname}/report`)
      },
    },
    {
      value: 'final',
      label: 'Reporte final',
      action: () => {
        router.push(`${pathname}/report`)
      },
    },
  ]

  const handleFilters = useCallback(
    (name: string, value: IDegreeCertificateTableFilterValue) => {
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

  const onGenerateDocument = useCallback(
    async (row: DegreeCertificateModel) => {
      if (row.certificateDriveId) {
        router.push(`${pathname}/${row.id}/view/${row.certificateDriveId}`)
        return
      }
      await handleGenerateDocument(row)
    },
    [handleGenerateDocument, router, pathname],
  )

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && tableData.length === 0) ||
    (!loader.length && tableData.length === 0 && isDataFiltered)

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Actas de grado"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Actas de grado' },
          ]}
          action={
            <>
              <Button
                onClick={popover.onOpen}
                variant="contained"
                startIcon={<Iconify icon="carbon:result" />}
                sx={{ mr: 1.5 }}
              >
                Reportes
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="ph:list-numbers" />}
                onClick={handleGenerateNumeration}
                sx={{ mr: 1.5 }}
              >
                Generar numerción
              </Button>
              <Button
                component={RouterLink}
                href={`${pathname}/templates`}
                variant="contained"
                startIcon={<Iconify icon="mingcute:document-3-line" />}
                sx={{ mr: 1.5 }}
              >
                Plantillas
              </Button>
              <Button
                component={RouterLink}
                href={`${pathname}/new`}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Actas de grado
              </Button>
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <DegreeCertificatesTableToolbar
            isDataFiltered={isDataFiltered}
            filters={filters}
            onFilters={handleFilters}
            setVisitedPages={setVisitedPages}
            setIsDataFiltered={setIsDataFiltered}
            table={table}
            setDataTable={setTableData}
            getFilteredCouncils={() => console.log('hi')}
          />

          {/* {isDataFiltered && (
            <DegreeCertificateTableFiltersResult
              onResetFilters={handleResetFilters}
              results={count}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

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
                          <DegreeCertificateTableRow
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
                            onGenerateDocument={() => onGenerateDocument(row)}
                            onRegenerateDocument={() => {
                              handleGenerateDocument(row)
                            }}
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {reportOptions.map((option) => (
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

export default memo(DegreeCertificateListView)
