/* eslint-disable no-magic-numbers */
'use client'

import { memo } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'

import Iconify from '../../../../core/iconify'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'

import { useProcessStore } from '../state/useProcessStore'
import { ProcessDetailsSummary } from '../components/ProcessDetailSummary'
import { ProcessDetailsSkeleton } from '../components/ProcessSkeleton'
import TemplateListView from '../../../../features/templates/presentation/view/TemplateListView'

const ProcessDetailsView = () => {
  const { id } = useParams()
  const router = useRouter()

  const settings = useSettingsContext()

  const { processes } = useProcessStore()
  const process = processes.find((council) => council.id! === +id)

  const renderSkeleton = <ProcessDetailsSkeleton />

  const renderError = (
    <EmptyContent
      filled
      title={`NO hay consejo con el id ${id}`}
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

  const renderProcess = process && (
    <>
      {/* <ProductDetailsToolbar
        backLink={pathname.replace(/\/\d+$/, '')}
        editLink={`${pathname}/edit`}
        liveLink={paths.product.details(`${product?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      /> */}

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          <ProcessDetailsSummary disabledActions process={process} />
        </Grid>
      </Grid>
    </>
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {false ? renderSkeleton : <>{false ? renderError : renderProcess}</>}
      <TemplateListView processId={+id} />
    </Container>
  )
}

export default memo(ProcessDetailsView)
