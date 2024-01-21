/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Label from '../../../../shared/components/label'
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/components/custom-dialog'
import { CouncilModel } from '../../data/models/CouncilModel'
import { usePopover } from '../../../../shared/components/custom-popover'
import CustomPopover from '../../../../shared/components/custom-popover/custom-popover'
import { CouncilType } from '../../domain/entities/ICouncil'

type Props = {
  row: CouncilModel
  selected: boolean
  onEditRow: VoidFunction
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export const CouncilTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) => {
  const { name, date, isActive, type } = row

  const confirm = useBoolean()

  const popover = usePopover()

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
                {type === CouncilType.EXTRAORDINARY
                  ? 'Extraordinario'
                  : 'Ordinario'}
              </Box>
            }
          />
        </TableCell>

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
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Borrar
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Borrar consejo"
        content="¿Estás seguro de que quieres eliminar este consejo?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Borrar
          </Button>
        }
      />
    </>
  )
}
