import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { CouncilModel } from '../../data/models/CouncilModel'
import Label from '../../../../shared/sdk/label'
import { format } from 'date-fns'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'
import { Box, Button } from '@mui/material'
import Iconify from '../../../../core/iconify'
import { useRouter } from 'next/navigation'

type Props = {
  council: CouncilModel
  disabledActions?: boolean
}

export const CouncilDetailsSummary = ({ council, ...other }: Props) => {
  const router = useRouter()

  const { name, id } = council

  const SUMMARY = [
    {
      title: 'Creado por',
      value: council?.createdBy,
      icon: 'eva:person-outline',
    },
    {
      title: 'Tipo',
      value: `${council?.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria'}`,
      icon: 'eva:calendar-outline',
    },
    {
      title: 'Fecha',
      value: `${
        council?.date !== undefined
          ? format(new Date(council.date), ' dd/MM/yyyy HH:mm ')
          : ''
      }`,
      icon: 'eva:calendar-outline',
    },
  ]

  const renderType = (
    <Label
      variant="soft"
      color={(council.isActive === true && 'success') || 'primary'}
    >
      {council.isActive === true ? 'Activo' : 'Inactivo'}
    </Label>
  )

  console.log(council)

  const renderError = (
    <EmptyContent
      filled
      title={`No hay consejo con el id ${id}`}
      action={
        <Button
          onClick={() => router.back()}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Regresar
        </Button>
      }
      sx={{ py: 10 }}
    />
  )

  const renderAttendees = () => (
    <>
      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={40} />
            <Typography variant="h4" color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h6">{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </>
  )

  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h5">{name}</Typography>

        {renderType}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {council ? renderAttendees() : renderError}
    </Stack>
  )
}
