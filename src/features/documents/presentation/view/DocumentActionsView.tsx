'use client'
import { Button, Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDocumentStore } from '../store/documentsStore'
import { useParams, useRouter } from 'next/navigation'

import { useCouncilsStore } from '../../../../features/council/presentation/store/councilsStore'
import { CouncilModel } from '../../../../features/council/data/models/CouncilModel'
import Iconify from '../../../../core/iconify'
import LoadingButton from '@mui/lab/LoadingButton'

export const DocumentActionsView = () => {
  const { id } = useParams()
  const router = useRouter()
  const {
    downloadDocument,
    generateRecord,
    processDocuments,
    isLoading,
    isProcessing,
  } = useDocumentStore()
  const { getById } = useCouncilsStore()

  const [currentCouncil, setCurrentCouncil] = useState<CouncilModel>()

  const fetchCurrentCouncil = async () => {
    const council = await getById(Number(id))
    setCurrentCouncil(council)
  }

  useEffect(() => {
    fetchCurrentCouncil()
  }, [])

  return (
    <Container>
      <Button variant="outlined" onClick={() => router.back()}>
        <Stack direction="row" spacing={1}>
          <Iconify icon="solar:arrow-left-bold-duotone" />
          <Typography variant="body1">Regresar</Typography>
        </Stack>
      </Button>
      <Stack spacing={2}>
        <h1>Acta</h1>
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-center',
            width: '100%',
          }}
        >
          <LoadingButton
            variant="outlined"
            sx={{
              height: '80px',
            }}
            loading={isProcessing}
            onClick={async () => {
              await processDocuments(Number(id))
              await fetchCurrentCouncil()
            }}
          >
            1. Procesar documentos
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            sx={{
              height: '80px',
            }}
            loading={isLoading}
            onClick={async () => {
              await generateRecord(Number(id))
              await fetchCurrentCouncil()
            }}
          >
            2. Generar plantilla acta
          </LoadingButton>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            disabled={!currentCouncil?.hasProcessedDocuments}
            onClick={() => downloadDocument(Number(id))}
          >
            1.2. Descargar Documento
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            disabled={!currentCouncil?.recopilationDriveId}
            onClick={() => {
              router.push(`view/${currentCouncil?.recopilationDriveId}`)
            }}
          >
            2.2. Ver acta
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
