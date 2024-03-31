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
import { DegreeCertificateModel } from '../../data/model'

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

export const CouncilTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  isOnTable = true,
  activeState,
}: Props) => {
  const { isActive, date } = row

  const confirm = useBoolean()

  const popover = usePopover()

  const finalActiveState = activeState !== undefined ? activeState : isActive

  return (
    <>
      <TableRow hover selected={selected}>
        {isOnTable && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}

        <TableCell>
          <ListItemText
            primary={format(new Date(date), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(date), 'dd MMM yyyy')}
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
              {finalActiveState === true ? 'Activo' : 'Inactivo'}
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
          sx={row.isActive ? { color: 'error.main' } : { color: 'green' }}
        >
          {row.isActive ? (
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
        title={row.isActive ? 'Desactivar consejo' : 'Activar consejo'}
        content={
          row.isActive
            ? '¿Está seguro de desactivar este consejo?'
            : '¿Está seguro de activar este consejo?'
        }
        action={
          <Button
            variant="contained"
            color={isActive ? 'error' : 'success'}
            onClick={() => {
              onDeleteRow()
              confirm.onFalse()
            }}
          >
            {isActive ? 'Desactivar' : 'Activar'}
          </Button>
        }
      />
    </>
  )
}
