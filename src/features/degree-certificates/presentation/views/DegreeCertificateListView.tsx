/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useState } from 'react'
import {
  Alert,
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
  TableSkeleton,
  emptyRows,
  useTable,
} from '../../../../shared/sdk/table'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'
import { getTableHead } from '../constants'
import { useDegreeCertificateView } from '../hooks/useDegreeCertificate'
import {
  DegreeCertificatesTableToolbar,
  IDegreeCertificateTableFilters,
  IDegreeCertificateTableFilterValue,
} from '../components/DegreeTableToolbar'
import { DegreeCertificateTableRow } from '../components/DegreeTableRow'
import CustomPopover, {
  usePopover,
} from '../../../../shared/sdk/custom-popover'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { DegCerBulkUploadDialog } from '../components/DegreeBulkUploadDialog'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useParams } from 'next/navigation'
import { resolveModuleByCode } from '../../../../shared/utils/ModuleUtil'
import { useSocketListeners } from '../../../../core/providers/use-socket-notifications'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'
import { UserRole } from '../../../../features/users/domain/entities/IUser'

const DegreeCertificateListView = ({ moduleId }: { moduleId: string }) => {
  useSocketListeners()
  const table = useTable()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const popover = usePopover()
  const addDegreeCertificatePopover = usePopover()
  const upload = useBoolean()
  const [visitedPages, setVisitedPages] = useState<number[]>([0])
  const [isDataFiltered, setIsDataFiltered] = useState(false)

  const { modules } = useModulesStore()
  const { user } = useAccountStore()
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
    handleUpdateRow,
    handleDeleteRow,
    handleGenerateDocument,
    handleGenerateNumeration,
    handleSearch,
    handleDownload,
    searchParams,
    filters,
    setFilters,
    deleteReportParam,
  } = useDegreeCertificateView({
    table,
    isDataFiltered,
    visitedPages,
    setVisitedPages,
  })

  const createActions = [
    {
      value: 'single',
      label: 'Individual',
      action: () => {
        const params = filtersToSearch(filters)
        return router.push(`${pathname}/new?${params.toString()}`)
      },
    },
    {
      value: 'multiple',
      label: 'Varios',
      action: upload.onTrue,
    },
  ]

  const filtersToSearch = useCallback(
    (filters: IDegreeCertificateTableFilters) => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, `${value}`)
        }
      })
      return params
    },
    [],
  )

  const handleFilters = useCallback(
    (name: string, value: IDegreeCertificateTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }))
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, `${value}`)

      router.replace(`${pathname}?${params.toString()}`)
    },
    [table],
  )

  const handleEditRow = useCallback(
    (id: string) => {
      const params = filtersToSearch(filters)
      router.push(`${pathname}/${id}/edit?${params.toString()}`)
    },
    [router],
  )

  const onGenerateDocument = useCallback(
    async (row: DegreeCertificateModel) => {
      if (row.certificateDriveId) {
        const params = filtersToSearch(filters)
        router.push(
          `${pathname}/${row.id}/view/${
            row.certificateDriveId
          }?${params.toString()}`,
        )
        return
      }
      await handleGenerateDocument(row)
    },
    [handleGenerateDocument, router, pathname],
  )

  const onShowGradesSheet = useCallback(
    (row: DegreeCertificateModel) => {
      const params = filtersToSearch(filters)
      router.push(
        `${pathname}/${row.id}/view/${
          row.gradesSheetDriveId
        }**spreadsheet**?${params.toString()}`,
      )
    },
    [router, pathname],
  )

  const onShowReportTemplate = useCallback(() => {
    const params = filtersToSearch(filters)
    router.push(
      `${pathname}/view/${
        module.reportTemplateDriveId
      }**spreadsheet**?${params.toString()}`,
    )
  }, [router, pathname])

  const getReportOptions = () => {
    const options = [
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
        action: () => {
          onShowReportTemplate()
        },
      },
    ]

    if (user?.role === UserRole.ADMIN || user?.role === UserRole.TEMP_ADMIN) {
      return options
    } else {
      return options.slice(0, 2)
    }
  }

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
      {user?.role === UserRole.ADMIN ||
        (user?.role === UserRole.TEMP_ADMIN && (
          <Button
            component={RouterLink}
            href={`${pathname}/templates`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:document-3-line" />}
            sx={{ mr: 1.5 }}
          >
            Plantillas
          </Button>
        ))}
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={addDegreeCertificatePopover.onOpen}
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
          handleFilters('startDate', new Date(new Date().setMonth(0, 1)))
          handleFilters('endDate', new Date())
          deleteReportParam()
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
    const params = filtersToSearch(filters)
    router.push(`${pathname}/${id}?${params.toString()}`)
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
            {
              name: 'Actas de grado',
            },
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
          {filters.isReport && filters.isEnd === true && (
            <Alert
              severity="info"
              variant="outlined"
              sx={{
                mb: 3,
              }}
            >
              Las actas deben tener fecha de presentación y asistencia del
              presidente de acta para formar el reporte final
            </Alert>
          )}
          {filters.isReport && filters.isEnd === false && (
            <Alert
              severity="info"
              variant="outlined"
              sx={{
                mb: 3,
              }}
            >
              Se muestran las actas que no tengan asignada la fecha de
              presentacion
            </Alert>
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
                  headLabel={getTableHead(filters.isReport as boolean)}
                  rowCount={count}
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
                            onDeleteDegreeCertificate={() =>
                              handleDeleteRow(row)
                            }
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
            onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              table.onChangeRowsPerPage(e)
            }}
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
        {getReportOptions().map((option) => (
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
        open={addDegreeCertificatePopover.open}
        onClose={addDegreeCertificatePopover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {createActions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              addDegreeCertificatePopover.onClose()
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
