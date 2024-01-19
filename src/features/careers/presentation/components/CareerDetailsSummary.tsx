import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { ICareer } from '../../domain/entities/ICareer'

type Props = {
  career: ICareer
  disabledActions?: boolean
}

export const CareerDetailsSummary = ({ career, ...other }: Props) => {
  const {
    name,
    coordinator,
    credits,
    internshipHours,
    isActive,
    menDegree,
    vinculationHours,
    womenDegree,
  } = career

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {}
    </Typography>
  )

  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h5">{name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {credits}
        </Typography>

        {renderSubDescription}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Stack>
  )
}
