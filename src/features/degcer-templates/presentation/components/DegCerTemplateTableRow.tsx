/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import Iconify from '../../../../core/iconify'

import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'
import { Stack } from '@mui/material'

type Props = {
  row: DegCerTemplateModel
  selected: boolean
  onViewRow: (id: string) => void
  activeState?: boolean | null
}

export const DegCerTableRow = ({ row, selected, onViewRow }: Props) => {
  const getStatusIcon = (code: string) => {
    switch (code) {
      case 'NO_RESENTACION':
        return (
          <Iconify icon="solar:document-bold" style={{ color: '#e8ec0e' }} />
        )
      case 'APRO':
        return (
          <Iconify icon="solar:document-bold" style={{ color: '#10d150' }} />
        )
      case 'REPR':
        return (
          <Iconify icon="solar:document-bold" style={{ color: '#f44336' }} />
        )
      default:
        return (
          <Iconify icon="solar:document-bold" style={{ color: '#8f8f8f' }} />
        )
    }
  }
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <ListItemText
            primary={row.code}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          {row.certificateTypeCareers.map((career) => (
            <ListItemText
              key={career.id}
              primary={career.career.name}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          ))}
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
            {row.certificateTypeStatuses.map((status) => (
              <ListItemText
                key={status.id}
                primary={getStatusIcon(status.certificateStatus.code)}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                onClick={() => onViewRow(status.driveId)}
              />
            ))}
          </Stack>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={
              <Iconify
                icon="solar:document-bold"
                style={{ color: ' #00d8f5' }}
              />
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
      </TableRow>
    </>
  )
}
