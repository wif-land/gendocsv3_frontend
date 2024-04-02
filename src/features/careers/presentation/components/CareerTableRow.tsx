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
import Label from '../../../../shared/sdk/label'
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { CareerModel } from '../../data/models/CareerModel'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'

type Props = {
  row: CareerModel
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export const CareerTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) => {
  const confirm = useBoolean()
  const popover = usePopover()

  const {
    name,
    isActive,
    coordinator,
    credits,
    internshipHours,
    vinculationHours,
  } = row

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
                onClick={onEditRow}
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
                {`${(coordinator as IFunctionary)?.firstName} ${(
                  coordinator as IFunctionary
                )?.firstLastName} - Coordinador`}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={credits}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={internshipHours}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={vinculationHours}
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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={row.isActive ? 'Desactivar carrera' : 'Activar carrera'}
        content={
          row.isActive
            ? 'Está seguro de desactivar la carrera?'
            : 'Está seguro de activar la carrera?'
        }
        action={
          <Button
            variant="contained"
            color={row.isActive ? 'error' : 'success'}
            onClick={onDeleteRow}
          >
            {row.isActive ? 'Desactivar' : 'Activar'}
          </Button>
        }
      />
    </>
  )
}
