'use client'
import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import Iconify from '../iconify'
import { VariablesAccordion } from '../variables-accordion/varibles-accordion'
import { VariableProvider } from '../../../core/providers/variables-provider'
import { useRouter } from 'next/navigation'

const DocumentVisualizer = ({
  driveId,
  returnLink,
  shouldLoadVariables = false,
}: {
  driveId: string
  returnLink: string
  shouldLoadVariables?: boolean
}) => {
  const isSpreadsheet = driveId.includes('**spreadsheet**')
  const router = useRouter()

  const documentURL = !isSpreadsheet
    ? `https://docs.google.com/document/d/${driveId}`
    : `https://docs.google.com/spreadsheets/d/${driveId.replace(
        '**spreadsheet**',
        '',
      )}`

  return (
    <div>
      <VariableProvider>
        <Button variant="outlined" onClick={() => router.back()}>
          <Stack direction="row" spacing={1}>
            <Iconify icon="solar:arrow-left-bold-duotone" />
            <Typography variant="body1">Regresar</Typography>
          </Stack>
        </Button>
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            mt: 2,
            p: 2,
          }}
        >
          <Stack
            sx={{
              flexGrow: 3,
              flexBasis: 90,
            }}
          >
            <iframe src={documentURL} width="100%" height="1000px" />
          </Stack>
          {shouldLoadVariables && (
            <>
              <Stack
                sx={{
                  flexGrow: 1,
                  flexBasis: 10,
                }}
              >
                <VariablesAccordion />
              </Stack>
            </>
          )}
        </Stack>
      </VariableProvider>
    </div>
  )
}

export default DocumentVisualizer
