/* eslint-disable @typescript-eslint/no-explicit-any */
export const emptyRows = (
  page: number,
  rowsPerPage: number,
  arrayLength: number,
) => (page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0)

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export const getComparator = <Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key,
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
