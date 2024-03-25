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

import { TemplateTableToolbar } from '../components/TemplateTableTooldar'
import { TABLE_HEAD } from '../constants'
import { TemplateTableRow } from '../components/TemplateTableRow'
import { ProcessModel } from '../../../processes/data/models/ProcessesModel'
import { TemplatesTableFiltersResult } from '../components/TemplateTableFiltersResult'

const TemplateListView = ({ process }: { process: ProcessModel }) => {
  const table = useTable()
  const router = useRouter()
  const pathname = usePathname()
  const settings = useSettingsContext()
  const confirm = useBoolean()
  const [isDataFiltered, setIsDataFiltered] = useState(false)
  const pathNameWithoutId = pathname.split('/').slice(0, -1).join('/')

  const [searchTerm, setSearchTerm] = useState('')

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
    setSearchTerm('')
    setIsDataFiltered(false)
    setTemplates([])
  }

  const {
    loader,
    templates,
    count,
    setTemplates,
    handleSearch,
    handleUpdateRow,
  } = useTemplateView({
    processId: process.id!,
    isDataFiltered,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound =
    (!loader.length && count === 0) ||
    (!loader.length && count === 0 && isDataFiltered)

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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setDataTable={setTemplates}
            setIsDataFiltered={setIsDataFiltered}
            getFilteredTemplates={handleSearch}
          />

          {isDataFiltered && (
            <TemplatesTableFiltersResult
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
                  templates.map((row) => row.id!.toString()),
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
                      templates.map((row) => row.id!.toString()),
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
                      {templates.map((row) => (
                        <TemplateTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id!.toString())}
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, count)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
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

export default memo(TemplateListView)
