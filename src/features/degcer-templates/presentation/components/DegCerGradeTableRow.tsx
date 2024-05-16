/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import Iconify from '../../../../core/iconify'

import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'

type Props = {
  row: DegCerGradesModel
  selected: boolean
  handleDelete: (gradeId: number) => void
}

export const DegCerGradeTableRow = ({ row, selected, handleDelete }: Props) => (
  <>
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText
          primary={row.gradeVariable}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={row.gradeTextVariable}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={row.cell}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={<Iconify icon="mdi:trash" style={{ color: '#b91313' }} />}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          sx={{ cursor: 'pointer' }}
          onClick={() => handleDelete(row.id as number)}
        />
      </TableCell>
    </TableRow>
  </>
)
