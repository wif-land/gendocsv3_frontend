import Link from 'next/link'
import { Box, Button, Container, Typography } from '@mui/material'

export default () => (
  <Container
    sx={{
      display: 'flex',
      minHeight: '80dvh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      px: { xs: 2, md: 3 },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        maxWidth: 400,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        alt="Ilustración 404"
        src="/assets/404.jpg"
        sx={{
          aspectRatio: '1 / 1',
          width: '100%',
          maxWidth: 350,
          borderRadius: 2,
          objectFit: 'cover',
        }}
      />
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem' },
            fontWeight: 'bold',
            lineHeight: '1.2',
          }}
        >
          ¡Vaya! Página no encontrada.
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
          La página que buscas no existe o se ha movido.
        </Typography>
      </Box>
      <Button
        component={Link}
        href="/dashboard"
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: 'grey.900',
          color: 'grey.50',
          '&:hover': { bgcolor: 'grey.800' },
          '&:focusVisible': {
            outline: '1px solid',
            outlineColor: 'grey.900',
          },
        }}
      >
        Volver a la página de inicio
      </Button>
    </Box>
  </Container>
)
