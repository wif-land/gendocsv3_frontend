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
import { getTableHead, defaultFilters } from '../constants'
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
import { DegCerBulkUploadDialog } from '../components/DegreeCertificateBulkUploadDialog'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useParams } from 'next/navigation'
import { resolveModuleByCode } from '../../../../shared/utils/ModuleUtil'

const DegreeCertificateListView = ({ moduleId }: { moduleId: string }) => {
  const table = useTable()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const popover = usePopover()
  const addStudentPopover = usePopover()
  const upload = useBoolean()
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const [filters, setFilters] =
    useState<IDegreeCertificateTableFilters>(defaultFilters)
  const { modules } = useModulesStore()
  const { codeModule } = useParams()

  const module = resolveModuleByCode(modules, codeModule as string)

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
    handleSearch,
    handleDownload,
  } = useDegreeCertificateView({
    table,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
    filters,
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

  const onShowGradesSheet = useCallback(
    (row: DegreeCertificateModel) => {
      router.push(
        `${pathname}/${row.id}/view/${row.gradesSheetDriveId}**spreadsheet**`,
      )
    },
    [router, pathname],
  )

  const onShowReportTemplate = useCallback(() => {
    router.push(
      `${pathname}/view/${module.reportTemplateDriveId}**spreadsheet**`,
    )
  }, [router, pathname])

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setVisitedPages([])
    setIsDataFiltered(false)
    setTableData([])
  }

  const reportOptions = [
    {
      value: 'start',
      label: 'Reporte inicial',
      action: () => {
        handleFilters('isReport', true)
        handleFilters('isEnd', false)
      },
    },
    {
      value: 'final',
      label: 'Reporte final',
      action: () => {
        handleFilters('isReport', true)
        handleFilters('isEnd', true)
      },
    },
    {
      value: 'template',
      label: 'Plantilla',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      action: () => {
        onShowReportTemplate()
      },
    },
  ]

  const degreeActions = (
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
        Generar numeración
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
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={addStudentPopover.onOpen}
      >
        Actas de grado
      </Button>
    </>
  )

  const reportActions = (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="ph:arrow-left-fill" />}
        onClick={() => {
          handleFilters('isReport', false)
          handleFilters('isEnd', false)
          handleResetFilters()
        }}
        sx={{ mr: 1.5 }}
      >
        Actas de grado
      </Button>
      <Button
        variant="contained"
        startIcon={<Iconify icon="ph:list-numbers" />}
        onClick={() => handleDownload(filters as IDegreeCertificateFilters)}
        sx={{ mr: 1.5 }}
      >
        {filters.isEnd === false
          ? 'Generar reporte inicial'
          : 'Generar reporte final'}
      </Button>
    </>
  )

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && tableData.length === 0) ||
    (!loader.length && tableData.length === 0 && isDataFiltered)

  const openDegreeCertificateDetail = (id: number) => {
    router.push(`${pathname}/${id}`)
  }

  return (
    <div key={moduleId}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={
            filters.isReport === false
              ? 'Actas de grado'
              : filters.isEnd === false
                ? 'Actas de grado reporte inicial'
                : 'Actas de grado reporte final'
          }
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Actas de grado' },
          ]}
          action={filters.isReport === false ? degreeActions : reportActions}
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
            getFilteredDegreCertificates={handleSearch}
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
                  headLabel={getTableHead(filters.isReport as boolean)}
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
                            onOpenAttendance={() =>
                              openDegreeCertificateDetail(row.id!)
                            }
                            onShowSheetsGrade={() => onShowGradesSheet(row)}
                            isReport={filters.isReport as boolean}
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

      <DegCerBulkUploadDialog open={upload.value} onClose={upload.onFalse} />

      <CustomPopover
        open={addStudentPopover.open}
        onClose={addStudentPopover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {createActions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              addStudentPopover.onClose()
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
