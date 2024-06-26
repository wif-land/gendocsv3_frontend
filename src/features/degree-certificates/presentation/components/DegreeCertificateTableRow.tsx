/* eslint-disable @typescript-eslint/no-explicit-any */
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
import dayjs from 'dayjs'

type Props = {
  row: DegreeCertificateModel
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onGenerateDocument: VoidFunction
  onShowSheetsGrade: VoidFunction
  onRegenerateDocument: VoidFunction
  onOpenAttendance: VoidFunction
  onDeleteDegreeCertificate: VoidFunction
  activeState?: boolean | null
  isOnTable?: boolean
  isReport?: boolean
}

export const DegreeCertificateTableRow = ({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  isOnTable = true,
  activeState,
  onGenerateDocument,
  onOpenAttendance,
  onShowSheetsGrade,
  onRegenerateDocument,
  onDeleteDegreeCertificate,
  isReport = false,
}: Props) => {
  const { isClosed, presentationDate } = row

  const studentName = `${(row.student as IStudent).firstName} ${
    (row.student as IStudent).secondName
  } ${(row.student as IStudent).firstLastName} ${
    (row.student as IStudent).secondLastName
  }`

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
          <ListItemText
            primary={row.auxNumber ?? ''}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.number ?? '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.topic}
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={studentName}
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
            secondary={(row.student as IStudent).dni}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={
              presentationDate
                ? dayjs(presentationDate)
                    .tz('America/Bogota')
                    .format('DD/MM/YYYY HH:mm')
                : // format(new Date(presentationDate), 'dd/MM/yyyy HH:MM')
                  ''
            }
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
            primary={(row.room as IRoom)?.name}
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
              color={(finalActiveState === true && 'error') || 'success'}
            >
              {finalActiveState === true ? 'Cerrado' : 'Abierto'}
            </Label>
          )}
        </TableCell>

        {isReport === false && (
          <TableCell align="right">
            <IconButton
              color={popover.open ? 'primary' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose()
          }}
          sx={row.isClosed ? { color: 'green' } : { color: 'orange' }}
        >
          {row.isClosed ? (
            <>
              <Iconify icon="ei:check" />
              Abrir
            </>
          ) : (
            <>
              <Iconify icon="simple-line-icons:lock" width="48" height="48" />
              Cerrar
            </>
          )}
        </MenuItem>
        {!row.isClosed && (
          <>
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
                onOpenAttendance()
                popover.onClose()
              }}
            >
              <Iconify icon="formkit:people" />
              Asistencia
            </MenuItem>

            <MenuItem
              onClick={() => {
                onShowSheetsGrade()
              }}
            >
              <Iconify icon="solar:document-bold-duotone" />
              Notas
            </MenuItem>

            <MenuItem
              onClick={() => {
                onGenerateDocument()
                popover.onClose()
              }}
            >
              <Iconify icon="solar:document-bold-duotone" />
              Documento
            </MenuItem>
            {row.certificateDriveId && (
              <MenuItem
                onClick={() => {
                  onRegenerateDocument()
                  popover.onClose()
                }}
              >
                <Iconify icon="ph:repeat" />
                Regenerar
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                onDeleteDegreeCertificate()
                popover.onClose()
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="simple-line-icons:close" width="48" height="48" />
              Eliminar
            </MenuItem>
          </>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={
          row.isClosed
            ? 'Marcar acta de grado como abierta'
            : 'Marcar acta de grado como cerrada'
        }
        content={
          row.isClosed
            ? '¿Está seguro de marcar esta acta de grado como abierta?'
            : '¿Está seguro de marcar esta acta de grado como cerrada?'
        }
        action={
          <Button
            variant="contained"
            color={isClosed ? 'success' : 'error'}
            onClick={() => {
              onDeleteRow()
              confirm.onFalse()
            }}
          >
            {isClosed ? 'Abrir' : 'Cerrar'}
          </Button>
        }
      />
    </>
  )
}
