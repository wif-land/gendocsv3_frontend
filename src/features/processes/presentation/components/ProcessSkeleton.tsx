import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Paper, { PaperProps } from '@mui/material/Paper'
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2'

export const ProcessItemSkeleton = ({ sx, ...other }: PaperProps) => (
  <Paper
    variant="outlined"
    sx={{
      borderRadius: 2,
      ...sx,
    }}
    {...other}
  >
    <Stack sx={{ p: 1 }}>
      <Skeleton sx={{ paddingTop: '100%' }} />
    </Stack>

    <Stack spacing={2} sx={{ p: 3, pt: 2 }}>
      <Skeleton sx={{ width: 0.5, height: 16 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row">
          <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
          <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
          <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
        </Stack>
        <Skeleton sx={{ width: 40, height: 16 }} />
      </Stack>
    </Stack>
  </Paper>
)

export const ProcessDetailsSkeleton = ({ ...other }: Grid2Props) => (
  <Grid container spacing={8} {...other}>
    <Grid xs={12} md={6} lg={7}>
      <Skeleton sx={{ paddingTop: '100%' }} />
    </Grid>

    <Grid xs={12} md={6} lg={5}>
      <Stack spacing={3}>
        <Skeleton variant="circular" sx={{ width: 80, height: 80 }} />
        <Skeleton sx={{ height: 240 }} />
        <Skeleton sx={{ height: 16 }} />
        <Skeleton sx={{ height: 16, width: 0.75 }} />
        <Skeleton sx={{ height: 16, width: 0.5 }} />
      </Stack>
    </Grid>

    <Grid xs={12}>
      <Stack direction="row" alignItems="center">
        {[1, 1, 1].map((_, index) => (
          <Stack
            key={index}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ width: 1 }}
          >
            <Skeleton variant="circular" sx={{ width: 80, height: 80 }} />
            <Skeleton sx={{ height: 16, width: 160 }} />
            <Skeleton sx={{ height: 16, width: 80 }} />
          </Stack>
        ))}
      </Stack>
    </Grid>
  </Grid>
)
