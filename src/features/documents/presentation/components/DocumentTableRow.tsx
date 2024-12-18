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
import Iconify from '../../../../core/iconify'
import { ConfirmDialog } from '../../../../shared/sdk/custom-dialog'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { DocumentModel } from '../../data/models/DocumentsModel'
import Stack from '@mui/material/Stack'
import { useProcessStore } from '../../../../features/processes/presentation/state/useProcessStore'
import { useCouncilsStore } from '../../../../features/council/presentation/store/councilsStore'

type Props = {
  row: DocumentModel
  onViewRow: VoidFunction
  onDeleteRow: VoidFunction
}

export const DocumentTableRow = ({ row, onDeleteRow, onViewRow }: Props) => {
  const { number, description, createdAt } = row
  const { processes } = useProcessStore()
  const { councils } = useCouncilsStore()

  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer', alignItems: 'center' }}
              >
                {number}
              </Link>
            }
            secondary={
              <Box
                component="div"
                sx={{ typography: 'body2', color: 'text.disabled' }}
              >
                {description}
              </Box>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(
              new Date(createdAt || Date.now()),
              'dd/MM/yyyy hh:mm',
            )}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell sx={{ alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="start"
              >
                {row.userName ?? 'N/A'}
              </Stack>
            }
          />
        </TableCell>

        <TableCell sx={{ alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="start"
              >
                {councils?.find((council) => council.id === row.councilId)
                  ?.name || 'N/A'}
              </Stack>
            }
          />
        </TableCell>

        <TableCell sx={{ alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="start"
              >
                {processes
                  ?.map((process) => {
                    const template = process.templateProcesses?.find(
                      (template) => template.id === row.templateId,
                    )

                    if (template !== undefined) {
                      return template.name
                    }
                  })
                  .filter((value) => value !== undefined)[0] || 'N/A'}
              </Stack>
            }
          />
        </TableCell>

        <TableCell align="center">
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
        title="Borrar documento"
        content="¿Estás seguro de que quieres eliminar este documento?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Borrar
          </Button>
        }
      />
    </>
  )
}
