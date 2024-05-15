'use client'

import { memo, useCallback } from 'react'
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs'
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
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { TABLE_HEAD } from '../constants'
import { useDegCerTemplatesView } from '../hooks/useDegCerTemplate'

import { DegCerTableRow } from '../components/DegCerTemplateTableRow'
import Iconify from '../../../../shared/sdk/iconify'
import Link from 'next/link'

const DegreeCertificateListView = () => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const returnLink = usePathname().substring(0, usePathname().lastIndexOf('/'))

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}`)
    },
    [router],
  )

  const { loader, tableData, degCerTemplates } = useDegCerTemplatesView({
    table,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && degCerTemplates.length === 0) ||
    (!loader.length && degCerTemplates.length === 0)

  return (
    <div>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Plantillas de actas de grado"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Actas de grado' },
          ]}
        />

        <Link
          href={returnLink}
          passHref
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Button variant="outlined" sx={{ my: 2 }}>
            <Stack direction="row" spacing={1}>
              <Iconify icon="solar:arrow-left-bold-duotone" />
              <Typography variant="body1">Regresar</Typography>
            </Stack>
          </Button>
        </Link>

        <Card>
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
                  rowCount={degCerTemplates.length}
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
                          <DegCerTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
                            onViewRow={handleViewRow}
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
            count={degCerTemplates.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </div>
  )
}

export default memo(DegreeCertificateListView)
