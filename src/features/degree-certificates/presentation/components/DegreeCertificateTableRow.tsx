/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Label from '../../../../shared/sdk/label'
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'
import {
  IDegreeModality,
  IRoom,
} from '../../../../core/providers/domain/entities/ICertificateProvider'

type Props = {
  row: DegreeCertificateModel
  selected: boolean
  onEditRow: VoidFunction
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  activeState?: boolean | null
  isOnTable?: boolean
}

export const DegreeCertificateTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  isOnTable = true,
  activeState,
}: Props) => {
  const { isClosed, presentationDate } = row

  const studentName = `${(row.student as IStudent).firstName} ${
    (row.student as IStudent).secondName
  } ${(row.student as IStudent).firstLastName} ${
    (row.student as IStudent).secondLastName
  }`

  console.log(studentName)

  console.log(row)

  const confirm = useBoolean()

  const popover = usePopover()

  const finalActiveState = activeState !== undefined ? activeState : isClosed

  return (
    <>
      <TableRow hover selected={selected}>
        {isOnTable && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}

        <TableCell>
          {/* <ListItemText
            primary={format(new Date(presentationDate), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          /> */}
          <ListItemText
            primary={row.topic}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={studentName}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondary={(row.student as IStudent).dni}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(presentationDate), 'dd MMM yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={(row.degreeModality as IDegreeModality).name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={(row.room as IRoom).name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          {activeState === null ? (
            <Label variant="soft" color="warning">
              No disponible
            </Label>
          ) : (
            <Label
              variant="soft"
              color={(finalActiveState === true && 'success') || 'primary'}
            >
              {finalActiveState === true ? 'Abierto' : 'Cerrado'}
            </Label>
          )}
        </TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Detalles
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose()
          }}
          sx={row.isClosed ? { color: 'error.main' } : { color: 'green' }}
        >
          {row.isClosed ? (
            <>
              <Iconify icon="radix-icons:lock-closed" />
              Desactivar
            </>
          ) : (
            <>
              <Iconify icon="radix-icons:lock-open-2" />
              Activar
            </>
          )}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={row.isClosed ? 'Desactivar consejo' : 'Activar consejo'}
        content={
          row.isClosed
            ? '¿Está seguro de desactivar este consejo?'
            : '¿Está seguro de activar este consejo?'
        }
        action={
          <Button
            variant="contained"
            color={isClosed ? 'error' : 'success'}
            onClick={() => {
              onDeleteRow()
              confirm.onFalse()
            }}
          >
            {isClosed ? 'Desactivar' : 'Activar'}
          </Button>
        }
      />
    </>
  )
}
