/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import { DocumentModel } from '../../data/models/DocumentsModel'
import { format } from 'date-fns'
import { Stack } from '@mui/material'

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
          primary={format(
            new Date(row.createdAt || Date.now()),
            'dd/MM/yyyy hh:mm',
          )}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell sx={{ alignItems: 'center' }}>
        <ListItemText
          disableTypography
          primaryTypographyProps={{ typography: 'body2', noWrap: false }}
          primary={row.userName ?? 'N/A'}
        />
      </TableCell>

      <TableCell sx={{ alignItems: 'center' }}>
        <ListItemText
          disableTypography
          primary={
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="start"
            >
              {row.councilName || 'N/A'}
            </Stack>
          }
        />
      </TableCell>

      <TableCell sx={{ alignItems: 'center' }}>
        <ListItemText
          disableTypography
          primary={
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="start"
            >
              {row.templateName || 'N/A'}
            </Stack>
          }
        />
      </TableCell>
    </TableRow>
  </>
)
