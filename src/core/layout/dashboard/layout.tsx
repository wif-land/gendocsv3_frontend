import Box from '@mui/material/Box'
import Main from './main'
import Header from './header'
import NavMini from './nav-mini'
import NavVertical from './nav-vertical'
import NavHorizontal from './nav-horizontal'
import { useSettingsContext } from '../../../shared/sdk/settings'
import { useResponsive } from '../../../shared/hooks/use-responsive'
import { useBoolean } from '../../../shared/hooks/use-boolean'
import { useNavData } from './config-navigation'

type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext()
  const lgUp = useResponsive('up', 'lg')
  const nav = useBoolean()
  const navData = useNavData()

  const isHorizontal = settings.themeLayout === 'horizontal'

  const isMini = settings.themeLayout === 'mini'

  const renderNavMini = <NavMini />

  const renderHorizontal = <NavHorizontal navData={navData} />

  const renderNavVertical = (
    <NavVertical
      openNav={nav.value}
      onCloseNav={nav.onFalse}
      navData={navData}
    />
  )

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    )
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    )
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  )
}
