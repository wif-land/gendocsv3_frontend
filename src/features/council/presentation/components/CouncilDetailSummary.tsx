import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CouncilModel } from '../../data/models/CouncilModel'
import { format } from 'date-fns'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'
import { Box, Button } from '@mui/material'
import Iconify from '../../../../core/iconify'
import { useRouter } from 'next/navigation'
import { CouncilType } from '../../domain/entities/ICouncil'

type Props = {
  council: CouncilModel
  councilId: number
  disabledActions?: boolean
}

export const CouncilDetailsSummary = ({
  council,
  councilId,
  ...other
}: Props) => {
  const router = useRouter()

  const SUMMARY = [
    {
      title: 'Creado por',
      value: council?.createdBy || 'N/A',
      icon: 'eva:person-outline',
    },
    {
      title: 'Tipo',
      value:
        council?.type === CouncilType.ORDINARY ? 'Ordinaria' : 'Extraordinaria',
      icon: 'eva:calendar-outline',
    },
    {
      title: 'Fecha',
      value: council?.date
        ? format(new Date(council.date), 'dd/MM/yyyy HH:mm')
        : 'N/A',
      icon: 'eva:calendar-outline',
    },
  ]

  const renderError = (
    <EmptyContent
      filled
      title={`No hay consejo con el id ${councilId}`}
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

  const renderDetails = () => (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Detalles
      </Typography>

      {SUMMARY.map((item) => (
        <Box
          key={item.title}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Iconify icon={item.icon} width={24} />
          <Box>
            <Typography variant="body2">{item.title}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {item.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )

  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      {council ? renderDetails() : renderError}
    </Stack>
  )
}
