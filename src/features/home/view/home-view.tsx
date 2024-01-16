'use client'

import { useScroll } from 'framer-motion'
import Box from '@mui/material/Box'
import HomeMinimal from '../home-minimal'
import MainLayout from '../../../core/layout/main/layout'
import ScrollProgress from '../../../shared/components/scroll-progress/scroll-progress'

export default function HomeView() {
  const { scrollYProgress } = useScroll()

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />
      </Box>
    </MainLayout>
  )
}
