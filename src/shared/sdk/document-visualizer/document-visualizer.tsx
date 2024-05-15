'use client'
import { Button, Container, IconButton, Stack, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import React from 'react'
import CustomBreadcrumbs from '../custom-breadcrumbs/custom-breadcrumbs'
import Iconify from '../iconify'
import Link from 'next/link'

const DocumentVisualizer = ({
  driveId,
  returnLink,
}: {
  driveId: string
  returnLink: string
}) => {
  const documentURL = `https://docs.google.com/document/d/${driveId}/edit?usp=sharing`

  return (
    <div>
      <Container>
        
        <CustomBreadcrumbs
          heading="Visualizador de documento"
          links={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Visualizador de documentos' },
          ]}
        />
        <Link
          href={returnLink}
          passHref
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Button variant="outlined" sx={{ my: 2 }}>
            <Stack direction="row" spacing={1}>
              <Iconify icon="solar:arrow-left-bold-duotone" />
              <Typography variant="body1">Regresar</Typography>
            </Stack>
          </Button>
        </Link>
        <iframe src={documentURL} width="100%" height="1000px" />
      </Container>
    </div>
  )
}

export default DocumentVisualizer
