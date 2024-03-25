/* eslint-disable no-magic-numbers */
'use client'

import { memo } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

import Iconify from '../../../../core/iconify'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'

import { useProcessStore } from '../state/useProcessStore'

import TemplateListView from '../../../../features/templates/presentation/view/TemplateListView'

const ProcessDetailsView = () => {
  const { id } = useParams()
  const router = useRouter()

  const settings = useSettingsContext()

  const { processes } = useProcessStore()
  const process = processes.find((council) => council.id! === +id)

  const renderError = (
    <EmptyContent
      filled
      title={`NO hay proceso con el id ${id}`}
      action={
        <Button
          onClick={() => router.back()}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {process ? <TemplateListView process={process} /> : renderError}
    </Container>
  )
}

export default memo(ProcessDetailsView)
