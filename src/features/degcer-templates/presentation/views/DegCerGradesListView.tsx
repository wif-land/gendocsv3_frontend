'use client'

import { memo } from 'react'
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
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
import { GRADES_TABLE_HEAD } from '../constants'

import { useDegCerGrades } from '../hooks/useDegCerGrades'
import { DegCerGradeTableRow } from '../components/DegCerGradeTableRow'

const DegCerGradesListView = ({
  certificateStatusId,
}: {
  certificateStatusId: number
}) => {
  const table = useTable()

  const { tableData, degCerGrades, handleDelete } = useDegCerGrades({
    certificateStatusId,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound = degCerGrades.length === 0 || degCerGrades.length === 0

  return (
    <div>
      <Container>
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'hidden' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={GRADES_TABLE_HEAD}
                  rowCount={degCerGrades.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {!tableData.length ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {degCerGrades
                        .slice(table.page * 5, table.page * 5 + 5)
                        .map((row) => (
                          <DegCerGradeTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
                            handleDelete={handleDelete}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, 5, degCerGrades.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={degCerGrades.length}
            page={table.page}
            rowsPerPage={5}
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

export default memo(DegCerGradesListView)
