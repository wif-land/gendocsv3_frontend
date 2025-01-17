/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from 'next/navigation'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  emptyRows,
} from '../../../../shared/sdk/table'
import { DocumentTableToolbar } from '../components/DocumentTableToolbar'
import { RouterLink } from '../../../../core/routes/components'
import {
  Card,
  TableBody,
  TableContainer,
  Container,
  Button,
  Table,
} from '@mui/material'
import Iconify from '../../../../core/iconify'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import {
  DocumentTableRow,
  INotifyStudentOptions,
} from '../components/DocumentTableRow'
import { useDocumentView } from '../hooks/useDocumentsView'
import { TABLE_HEAD } from '../constants/constants'
import { DocumentTableFiltersResult } from '../components/DocumentTableFiltersResult'

const DocumentListView = ({ moduleId }: { moduleId: string }) => {
  const {
    loader,
    table,
    tableData,
    isDataFiltered,
    denseHeight,
    count,
    handleDeleteRow,
    handleChangePage,
    handleViewRow,
    handleResetFilters,
    handleNotifyStudent,
    handleChangeRowsPerPage,
  } = useDocumentView(moduleId)
  const pathname = usePathname()
  const confirm = useBoolean()
  const settings = useSettingsContext()

  const notFound =
    (!loader.length && count === 0) ||
    (!loader.length && count === 0 && isDataFiltered)

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Documentos"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Documentos' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${pathname}/new`}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo documento
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <DocumentTableToolbar />

          {isDataFiltered && (
            <DocumentTableFiltersResult
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
                  isMultiSelect={false}
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
                          <DocumentTableRow
                            key={row.id}
                            row={row}
                            onDeleteRow={() => handleDeleteRow(row.id!)}
                            onNotifyStudent={(
                              options?: INotifyStudentOptions,
                            ) => handleNotifyStudent(row.id!, options)}
                            onViewRow={() =>
                              handleViewRow(
                                row.id!.toString(),
                                row.driveId as string,
                              )
                            }
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, count)}
                  />

                  <TableNoData notFound={!!notFound} />
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
        title="Borrar"
        content={
          <>
            Estás seguro de que deseas borrar{' '}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse()
            }}
          >
            Delete
          </Button>
        }
      />
    </div>
  )
}

export default DocumentListView
