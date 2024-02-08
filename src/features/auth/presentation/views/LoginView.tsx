import React from 'react'
import { Grid, Typography } from '@mui/material'
import { LoginForm } from '../components/LoginForm'

const LoginView = () => (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
    style={{ maxHeight: '100vh' }}
  >
    <Grid
      item
      sm={6}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img
        src="https://w0.peakpx.com/wallpaper/951/996/HD-wallpaper-ipad-pro-2021-apple-ios-iphone-stock.jpg"
        alt="portada"
        style={{
          width: 'calc(100% - 1%)',
          height: 'calc(100vh - 1%)',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            Bienvenido de vuelta
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="center" gutterBottom>
            Ingresa tu correo y contraseña para continuar
          </Typography>
        </Grid>
        <Grid item>
          <LoginForm />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

export default LoginView
