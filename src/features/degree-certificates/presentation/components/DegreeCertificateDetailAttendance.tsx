import { Card, Box, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { Attendance } from './DCAttendance'

export const DegreeCertificateDetailAttendance = () => {
  const { id: degreeCertificateIdentifier } = useParams()
  const { loader } = useLoaderStore()

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Asistencia
      </Typography>
      <Card>
        <Attendance
          isLoading={loader.length > 0}
          degreeCertificateId={degreeCertificateIdentifier as unknown as number}
        />
      </Card>
    </Box>
  )
}
