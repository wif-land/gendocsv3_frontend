'use client'
import { Button, Container, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDocumentStore } from '../store/documentsStore'
import { useParams, useRouter } from 'next/navigation'

import { useCouncilsStore } from '../../../../features/council/presentation/store/councilsStore'
import { CouncilModel } from '../../../../features/council/data/models/CouncilModel'

export const DocumentActionsView = () => {
  const { id } = useParams()
  const router = useRouter()
  const { downloadDocument, generateRecord, processDocuments } =
    useDocumentStore()
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
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            onClick={async () => {
              await processDocuments(Number(id))
              await fetchCurrentCouncil()
            }}
          >
            1. Procesar documentos
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            onClick={async () => {
              await generateRecord(Number(id))
              await fetchCurrentCouncil()
            }}
          >
            2. Generar plantilla acta
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            disabled={!currentCouncil?.hasProcessedDocuments}
            onClick={() => downloadDocument(Number(id))}
          >
            3. Descargar Documento
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
            4. Ver acta
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
