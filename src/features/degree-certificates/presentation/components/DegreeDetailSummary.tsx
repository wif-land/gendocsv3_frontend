import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'
import { Box, Button, Grid } from '@mui/material'
import Iconify from '../../../../core/iconify'
import { useRouter } from 'next/navigation'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { CertificateStatus } from '../../../degcer-templates/domain/entities/IDegCerTemplates'

type Props = {
  degreeCertificate: DegreeCertificateModel
  degreeCertificateId: number
  disabledActions?: boolean
}

export const DegreeDetailsSummary = ({
  degreeCertificate,
  degreeCertificateId,
  ...other
}: Props) => {
  const router = useRouter()

  const SUMMARY: {
    title: string
    value: string
    icon: string
  }[] = [
    {
      title: 'Estudiante',
      value:
        `${degreeCertificate.student?.firstLastName} ${degreeCertificate.student?.secondLastName} ${degreeCertificate.student?.firstName} ${degreeCertificate.student?.secondName} ` ||
        'No especificado',
      icon: 'fe:user',
    },
    {
      title: 'Tema',
      value: degreeCertificate.topic || 'No especificado',
      icon: 'ion:book',
    },
    {
      title: 'Fecha de presentación',
      value: degreeCertificate?.presentationDate
        ? format(
            new Date(degreeCertificate.presentationDate),
            'dd/MM/yyyy HH:mm',
          )
        : 'Acta no presentada',
      icon: 'eva:calendar-outline',
    },
    {
      title: 'Tipo de grado',
      value: degreeCertificate?.degreeModality?.name || 'No especificado',
      icon: 'fe:book',
    },
    {
      title: 'Duración de la presentación',
      value: `${degreeCertificate?.duration} minutos` || 'No especificado',
      icon: 'fe:clock',
    },
    {
      title: 'Estado',
      value:
        `${(degreeCertificate?.certificateStatus as CertificateStatus)
          ?.femaleName} / ${(
          degreeCertificate?.certificateStatus as CertificateStatus
        )?.maleName}` || 'No especificado',
      icon: 'fe:activity',
    },
    {
      title: 'Link del acta de grado',
      value: degreeCertificate?.link || 'No especificado',
      icon: 'fe:link',
    },
  ]

  const renderError = (
    <EmptyContent
      filled
      title={`No hay acta de grado con el id ${degreeCertificateId}`}
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
      <Typography variant="h6" sx={{ mb: 1 }}>
        Detalles
      </Typography>

      <Grid container spacing={2}>
        {SUMMARY.map((item) => (
          <Grid item xs={12} md={6} key={item.title}>
            <Box
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
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  return (
    <Stack {...other}>
      {degreeCertificate ? renderDetails() : renderError}
    </Stack>
  )
}
