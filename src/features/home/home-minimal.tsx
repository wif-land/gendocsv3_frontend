import { m } from 'framer-motion'
import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { MotionViewport, varFade } from '../../shared/components/animate'

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled' }}
          >
            Minimal UI
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            What Minimal <br /> helps you?
          </Typography>
        </m.div>
      </Stack>
    </Container>
  )
}
