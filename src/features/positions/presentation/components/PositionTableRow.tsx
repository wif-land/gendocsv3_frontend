import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import { useBoolean } from '../../../../shared/hooks/use-boolean'
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'

import { PositionModel } from '../../data/models/PositionModel'
import { Box } from '@mui/material'

type Props = {
  row: PositionModel
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export const PositionTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) => {
  const confirm = useBoolean()
  const popover = usePopover()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
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
                {row.variable}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
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
                {`${row.functionary.firstName} ${row.functionary.secondName} ${row.functionary.firstLastName} ${row.functionary.secondLastName}`}
              </Link>
            }
            secondary={
              <Box
                component="div"
                sx={{ typography: 'body2', color: 'text.disabled' }}
              >
                {row.functionary.dni}
              </Box>
            }
          />
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
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:slash-fill" />
          Eliminar
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={'Eliminar cargo'}
        content={`Estás seguro que deseas eliminar el cargo ${row.name}?`}
        action={
          <Button variant="contained" color={'error'} onClick={onDeleteRow}>
            Eliminar
          </Button>
        }
      />
    </>
  )
}
