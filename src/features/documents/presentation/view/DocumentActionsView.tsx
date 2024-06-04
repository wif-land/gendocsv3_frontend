'use client'
import { Button, Container, Stack } from '@mui/material'
import React from 'react'
import { useDocumentStore } from '../store/documentsStore'
import { useParams } from 'next/navigation'

export const DocumentActionsView = () => {
  const { id } = useParams()
  const { downloadDocument, generateRecord, processDocuments } =
    useDocumentStore()

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
            onClick={() => processDocuments(Number(id))}
          >
            1. Procesar documentos
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            onClick={() => generateRecord(Number(id))}
          >
            2. Generar plantilla acta
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
            onClick={() => downloadDocument(Number(id))}
          >
            3. Descargar Documento
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: '80px',
            }}
          >
            4. Ver acta
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
