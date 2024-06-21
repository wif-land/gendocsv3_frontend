import React, { memo } from 'react'
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

import { STUDENT_DEGREE_CERTIFICATES_TABLE_HEAD } from '../constants/constants'
import { useDegreesByStudentView } from '../hooks/useDegreesByStudentView'
import { DegreesByStudentTableRow } from '../components/DegreesByStudentTableRow'

const DegByStudentListView = ({ studentDni }: { studentDni: string }) => {
  const table = useTable()

  const { tableData } = useDegreesByStudentView({
    studentDni,
  })

  const denseHeight = table.dense ? NO_DENSE : DENSE

  const notFound = !Array.isArray(tableData) || tableData.length === 0

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
                  headLabel={STUDENT_DEGREE_CERTIFICATES_TABLE_HEAD}
                  rowCount={Array.isArray(tableData) ? tableData.length : 0}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {!Array.isArray(tableData) ? (
                    [...Array(table.rowsPerPage)].map((_, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData
                        .slice(table.page * 5, table.page * 5 + 5)
                        .map((row) => (
                          <DegreesByStudentTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(
                              row.id!.toString(),
                            )}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, 5, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={Array.isArray(tableData) ? tableData.length : 0}
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

export default memo(DegByStudentListView)
