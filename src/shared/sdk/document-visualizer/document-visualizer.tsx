'use client'
import { Button, Container, IconButton, Stack, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import React from 'react'
import CustomBreadcrumbs from '../custom-breadcrumbs/custom-breadcrumbs'
import Iconify from '../iconify'
import Link from 'next/link'
import { IVariableList } from '@/core/providers/domain/entities/IVariableProvider'
import {
  useVariables,
  VariableProvider,
} from '@/core/providers/variables-provider'
import { VariablesAccordion } from '../variables-accordion/varibles-accordion'

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

  const documentURL = !isSpreadsheet
    ? `https://docs.google.com/document/d/${driveId}`
    : `https://docs.google.com/spreadsheets/d/${driveId.replace(
        '**spreadsheet**',
        '',
      )}`

  return (
    <div>
      <VariableProvider>
        <Link
          href={returnLink}
          passHref
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Button variant="outlined">
            <Stack direction="row" spacing={1}>
              <Iconify icon="solar:arrow-left-bold-duotone" />
              <Typography variant="body1">Regresar</Typography>
            </Stack>
          </Button>
        </Link>
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
          <Stack sx={{
            flexGrow: 3,
            flexBasis: 90,
          }}>
            <iframe src={documentURL} width="100%" height="1000px" />
          </Stack>
          <Stack
            sx={{
              flexGrow: 1,
            flexBasis: 10,

            }}
          >
            {shouldLoadVariables && (
              <>
                <VariablesAccordion />
              </>
            )}
          </Stack>
        </Stack>
      </VariableProvider>
    </div>
  )
}

export default DocumentVisualizer
