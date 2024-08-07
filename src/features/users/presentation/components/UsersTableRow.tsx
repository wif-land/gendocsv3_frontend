import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Label from '../../../../shared/sdk/label'
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { IUser } from '../../domain/entities/IUser'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'

type Props = {
  row: IUser
  selected: boolean
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
  activeState?: boolean | null
}

export const UsersTableRow = ({
  row,
  selected,
  onDeleteRow,
  onEditRow,
}: Props) => {
  const confirm = useBoolean()
  const popover = usePopover()
  const { user } = useAccountStore()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onEditRow}
                sx={{ cursor: 'pointer' }}
              >
                {`${row.firstName} ${row.secondName} ${row.firstLastName} ${row.secondLastName}`}
              </Link>
            }
            secondary={
              <Box
                component="div"
                sx={{ typography: 'body2', color: 'text.disabled' }}
              >
                {row.role}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.googleEmail}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.outlookEmail}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <Label variant="soft" color={row.isActive ? 'success' : 'primary'}>
            {row.isActive === true ? 'Activo' : 'Inactivo'}
          </Label>
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
            onEditRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        {row.id !== user?.id && (
          <MenuItem
            onClick={() => {
              confirm.onTrue()
              popover.onClose()
            }}
            sx={
              row.isActive ? { color: 'error.main' } : { color: 'success.main' }
            }
          >
            {row.isActive ? (
              <>
                <Iconify icon="eva:slash-fill" />
                Desactivar
              </>
            ) : (
              <>
                <Iconify icon="eva:checkmark-circle-fill" />
                Activar
              </>
            )}
          </MenuItem>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={row.isActive ? 'Desactivar usuario' : 'Activar usuario'}
        content={
          row.isActive
            ? 'Está seguro de desactivar el usuario?'
            : 'Está seguro de activar el usuario?'
        }
        action={
          <Button
            variant="contained"
            color={row.isActive ? 'error' : 'success'}
            onClick={() => {
              onDeleteRow()
              confirm.onFalse()
            }}
          >
            {row.isActive ? 'Desactivar' : 'Activar'}
          </Button>
        }
      />
    </>
  )
}
