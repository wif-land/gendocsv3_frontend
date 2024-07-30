/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import { DegreeCertificateModel } from '../../../../features/degree-certificates/data/models/DegreeCertificateModel'
import dayjs from 'dayjs'
import {
  ICertificateStatus,
  ICertificateType,
} from '../../../../core/providers/domain/entities/ICertificateProvider'

type Props = {
  row: DegreeCertificateModel
  selected: boolean
}

export const DegreesByStudentTableRow = ({ row, selected }: Props) => (
  <>
    <TableRow hover selected={selected}>
      <TableCell
        sx={{
          width: '25%',
          minWidth: '25%',
        }}
      >
        <ListItemText
          primary={row.number || 'Sin número'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={
            row.student.gender === 'Masculino'
              ? (row.certificateStatus as ICertificateStatus).maleName
              : (row.certificateStatus as ICertificateStatus).femaleName
          }
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={(row.certificateType as ICertificateType).name}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={row.topic}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={dayjs(new Date(row.presentationDate as any)).format(
            'DD/MM/YYYY HH:mm',
          )}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>
    </TableRow>
  </>
)
