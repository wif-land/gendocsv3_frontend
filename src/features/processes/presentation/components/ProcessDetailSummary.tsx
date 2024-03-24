import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { ProcessModel } from '../../data/models/ProcessesModel'

type Props = {
  process: ProcessModel
  disabledActions?: boolean
}

export const ProcessDetailsSummary = ({ process, ...other }: Props) => {
  const { name } = process

  const renderSubDescription = (
    <Typography variant="body2" color="textSecondary">
      {process.createdAt?.toString()}
    </Typography>
  )
  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h5">{name}</Typography>
        {renderSubDescription}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Stack>
  )
}
