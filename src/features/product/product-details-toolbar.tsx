import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Stack, { StackProps } from '@mui/material/Stack'
import { RouterLink } from '../../core/routes/components'
import Iconify from '../../core/iconify'

type Props = StackProps & {
  backLink: string
  editLink: string
  liveLink: string
  publish: string
  onChangePublish: (newValue: string) => void
  publishOptions: {
    value: string
    label: string
  }[]
}

export default function ProductDetailsToolbar({
  backLink,
  editLink,
  sx,
  ...other
}: Props) {
  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  )
}
