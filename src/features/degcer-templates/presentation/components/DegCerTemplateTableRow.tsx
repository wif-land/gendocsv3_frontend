/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import Iconify from '../../../../core/iconify'

import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { DegCerGradesForm } from './DegCerGradesForm'

type Props = {
  row: DegCerTemplateModel
  selected: boolean
  onViewRow: (id: string) => void
  activeState?: boolean | null
}

export const DegCerTableRow = ({ row, selected, onViewRow }: Props) => {
  const areGradesOpen = useBoolean()

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
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row">
            <ListItemText
              primary={
                <Iconify
                  icon="solar:document-bold"
                  style={{ color: ' #00d8f5' }}
                  onClick={() => onViewRow(`${row.driveId}**spreadsheet**`)}
                  sx={{ cursor: 'pointer' }}
                />
              }
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
            <ListItemText
              primary={
                <Iconify
                  icon="eva:more-vertical-fill"
                  style={{ color: ' #00d8f5' }}
                  onClick={areGradesOpen.onTrue}
                  sx={{ cursor: 'pointer' }}
                />
              }
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </Stack>
        </TableCell>
      </TableRow>
      <Dialog
        fullWidth
        maxWidth="md"
        open={areGradesOpen.value}
        onClose={areGradesOpen.onFalse}
      >
        <DialogTitle sx={{ pb: 2 }}>Celdas</DialogTitle>

        <DialogContent sx={{ typography: 'body2' }}>
          <DegCerGradesForm certificateStatusId={row.id} />
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={areGradesOpen.onFalse}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
