/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
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
import { CouncilModel } from '../../data/models/CouncilModel'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { CouncilType } from '../../domain/entities/ICouncil'

type Props = {
  row: CouncilModel
  selected: boolean
  onEditRow: VoidFunction
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onDocumentAction: (id: number) => void
  activeState?: boolean | null
  isOnTable?: boolean
}

export const CouncilTableRow = ({
  row,
  selected,
  // onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDocumentAction,
  // isOnTable = true,
  activeState,
}: Props) => {
  const { name, date, isActive, type } = row

  const confirm = useBoolean()

  const popover = usePopover()

  const finalActiveState = activeState !== undefined ? activeState : isActive

  return (
    <>
      <TableRow hover selected={selected}>
        {/* {isOnTable && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )} */}

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
            primary={format(new Date(date), 'dd/MM/yyyy')}
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
            onDocumentAction(row.id!)
          }}
        >
          <Iconify icon="solar:document-outline" />
          Documentos
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
              Cerrar
            </>
          ) : (
            <>
              <Iconify icon="radix-icons:lock-open-2" />
              Abrir
            </>
          )}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={row.isActive ? 'Cerrar consejo' : 'Abrir consejo'}
        content={
          row.isActive
            ? '¿Está seguro de cerrar este consejo?'
            : '¿Está seguro de abrir este consejo?'
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
            {isActive ? 'Cerrar' : 'Abrir'}
          </Button>
        }
      />
    </>
  )
}
