/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useState } from 'react'
import { useTemplateView } from '../hooks/useTemplatesView'
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
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { RouterLink } from '../../../../core/routes/components'

import {
  ITemplateTableFilters,
  ITemplateTableFilterValue,
  TemplateTableToolbar,
} from '../components/TemplateTableTooldar'
import { TABLE_HEAD, defaultFilters } from '../constants'
import { TemplateTableRow } from '../components/TemplateTableRow'
import { ProcessModel } from '../../../processes/data/models/ProcessesModel'
import { TemplatesTableFiltersResult } from '../components/TemplateTableFiltersResult'
import { TemplateModel } from '../../data/models/TemplatesModel'

const TemplateListView = ({ process }: { process: ProcessModel }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const pathNameWithoutId = pathname.split('/').slice(0, -1).join('/')

  const { loader, templates, handleUpdateRow } = useTemplateView({
    processId: process.id!,
    isDataFiltered,
  })

  const [filters, setFilters] = useState<ITemplateTableFilters>(defaultFilters)

  const dataFiltered = applyFilter({
    inputData: templates as TemplateModel[],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  })

  const handleFilters = useCallback(
    (name: string, value: ITemplateTableFilterValue) => {
      table.onResetPage()
      setFilters((prevState) => ({ ...prevState, [name]: value }))
    },
    [table],
  )

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/template/${id}/edit`)
    },
    [router],
  )

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/template/${id}`)
    },
    [router],
  )

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setIsDataFiltered(false)
  }
  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    !dataFiltered.length || (!loader.length && !dataFiltered.length)

  return (
    <div key={process!.id}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Plantillas"
          links={[
            { name: 'Procesos', href: pathNameWithoutId },
            { name: process!.name },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/template/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nueva plantilla
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <TemplateTableToolbar
            filters={filters}
            onFilters={handleFilters}
            setIsDataFiltered={setIsDataFiltered}
          />

          {isDataFiltered && (
            <TemplatesTableFiltersResult
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  templates!.map((row) => row.id!.toString()),
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
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      templates!.map((row) => row.id!.toString()),
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
                          <TemplateTableRow
                            key={row.id}
                            row={row}
                            rowUserId={row.userId}
                            selected={table.selected.includes(
                              row.id?.toString() as string,
                            )}
                            onSelectRow={() =>
                              table.onSelectRow(row.id!.toString())
                            }
                            onDeleteRow={() => handleUpdateRow(row)}
                            onEditRow={() => handleEditRow(row.id!.toString())}
                            onViewRow={() => handleViewRow(row.id!.toString())}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length,
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
        title="Cambiar estado de la plantilla"
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

const applyFilter = ({
  inputData,
  comparator,
  filters,
}: {
  inputData: TemplateModel[]
  comparator: (a: any, b: any) => number
  filters: ITemplateTableFilters
}) => {
  if (!inputData) return []
  let currentInputData = [...inputData]
  const { field, state } = filters

  const stabilizedThis = currentInputData.map(
    (el, index) => [el, index] as const,
  )
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  currentInputData = stabilizedThis.map((el) => el[0])

  if (field) {
    currentInputData = currentInputData.filter(
      (career) => career.name.toLowerCase().indexOf(field.toLowerCase()) !== -1,
    )
  }

  if (state !== undefined) {
    currentInputData = currentInputData.filter(
      (career) => career.isActive === state,
    )
  }

  return currentInputData
}

export default memo(TemplateListView)
