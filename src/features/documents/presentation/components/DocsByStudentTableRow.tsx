/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import { DocumentModel } from '../../data/models/DocumentsModel'

type Props = {
  row: DocumentModel
  selected: boolean
}

export const DocsByStudentTableRow = ({ row, selected }: Props) => (
  <>
    <TableRow hover selected={selected}>
      <TableCell
        sx={{
          width: '25%',
          minWidth: '25%',
        }}
      >
        <ListItemText
          primary={row.number}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={row.description}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>
    </TableRow>
  </>
)
