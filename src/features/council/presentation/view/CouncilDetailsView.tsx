/* eslint-disable no-magic-numbers */
'use client'

import { memo, useCallback, useState } from 'react'
import { alpha } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import { useCouncilStore } from '../store/councilsStore'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'
import { CouncilDetailsSkeleton } from '../components/CouncilSkeleton'
import Iconify from '../../../../core/iconify'
import { CouncilDetailsSummary } from '../components/CouncilDetailSummary'

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
]

const CouncilDetailsView = () => {
  const { id } = useParams()
  const router = useRouter()

  const settings = useSettingsContext()

  const { councils } = useCouncilStore()
  const product = councils.find((council) => council.id! === +id)

  const [currentTab, setCurrentTab] = useState('description')

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

  const renderSkeleton = <CouncilDetailsSkeleton />

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

  const renderProduct = product && (
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
          <CouncilDetailsSummary disabledActions product={product} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify
              icon={item.icon}
              width={32}
              sx={{ color: 'primary.main' }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {/* {currentTab === 'description' && (
          <ProductDetailsDescription description={'una buena descripcion'} />
        )} */}
      </Card>
    </>
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {false ? renderSkeleton : <>{false ? renderError : renderProduct}</>}
    </Container>
  )
}

export default memo(CouncilDetailsView)
