import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { LoginForm } from '../components/LoginForm'
import Image from 'next/image'
import Banner from '../../../../../public/assets/logo-sitio-fisei-2020.png'
import BannerBuild from '../../../../../public/assets/bannerfiseicorreos.png'

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
      columns={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        p: 3,
      }}
    >
      <Image
        src={Banner}
        alt="portada"
        priority
        style={{
          width: 'auto',
          height: 'auto',
        }}
      />
      <Box
        sx={{
          p: 3,
        }}
      >
        <Image
          src={BannerBuild}
          alt="portada"
          priority
          quality={100}
          style={{
            width: 'auto',
            height: 'auto',
          }}
        />
      </Box>
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
