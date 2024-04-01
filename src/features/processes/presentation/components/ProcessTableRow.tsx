import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import Iconify from '../../../../core/iconify'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Label from '../../../../shared/sdk/label'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'

import { ProcessModel } from '../../data/models/ProcessesModel'

type Props = {
  row: ProcessModel
  selected: boolean
  onEditRow: VoidFunction
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export const ProcessTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) => {
  const confirm = useBoolean()
  const popover = usePopover()

  const { name, isActive, createdAt } = row

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {name}
              </Link>
            }
            secondary={
              <Box
                component="div"
                sx={{ typography: 'body2', color: 'text.disabled' }}
              >
                {createdAt?.toString() || 'Sin fecha'}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(isActive === true && 'success') || 'primary'}
          >
            {isActive === true ? 'Activo' : 'Inactivo'}
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
            onViewRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:documents-linear" />
          Plantillas
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
        title={row.isActive ? 'Desactivar proceso' : 'Activar proceso'}
        content={
          row.isActive
            ? '¿Está seguro de desactivar este proceso?'
            : '¿Está seguro de activar este proceso?'
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
