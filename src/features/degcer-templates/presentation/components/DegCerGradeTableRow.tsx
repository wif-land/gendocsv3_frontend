/* eslint-disable @typescript-eslint/no-explicit-any */

import TableRow from '@mui/material/TableRow'

import TableCell from '@mui/material/TableCell'

import ListItemText from '@mui/material/ListItemText'

import Iconify from '../../../../core/iconify'

import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { Button } from '@mui/material'

type Props = {
  row: DegCerGradesModel
  selected: boolean
  handleDelete: (gradeId: number) => void
}

export const DegCerGradeTableRow = ({ row, selected, handleDelete }: Props) => {
  const confirm = useBoolean()
  return (
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
            onClick={confirm.onTrue}
          />
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={'Eliminar variable'}
        content={'¿Está seguro de eliminar esta celda?'}
        action={
          <Button
            variant="contained"
            color={'error'}
            onClick={() => {
              handleDelete(row.id as number)
              confirm.onFalse()
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  )
}
