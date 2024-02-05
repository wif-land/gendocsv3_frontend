import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { CouncilModel } from '../../data/models/CouncilModel'
import Label from '../../../../shared/components/label'

type Props = {
  council: CouncilModel
  disabledActions?: boolean
}

export default function CouncilDetailsSummary({ council, ...other }: Props) {
  const { name } = council

  const renderType = (
    <Label
      variant="soft"
      color={(council.isActive === true && 'success') || 'primary'}
    >
      {council.isActive === true ? 'Activo' : 'Inactivo'}
    </Label>
  )
  return (
    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h5">{name}</Typography>

        {renderType}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Stack>
  )
}
