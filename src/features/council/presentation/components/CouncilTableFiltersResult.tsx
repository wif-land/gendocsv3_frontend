import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack, { StackProps } from '@mui/material/Stack'
import Iconify from '../../../../core/iconify'

type Props = StackProps & {
  onResetFilters: () => void
  results: number
}

export const CouncilTableFiltersResult = ({
  onResetFilters,
  results,
  ...other
  // eslint-disable-next-line arrow-body-style
}: Props) => {
  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{`${results} `}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          resultados encontrados
        </Box>
      </Box>

      <Button
        color="error"
        onClick={() => onResetFilters()}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        Limpiar
      </Button>
    </Stack>
  )
}
