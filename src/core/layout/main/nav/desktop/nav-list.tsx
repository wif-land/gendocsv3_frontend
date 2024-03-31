'use client'

import { useEffect } from 'react'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import Portal from '@mui/material/Portal'
import { usePathname } from 'next/navigation'
import { NavItemProps } from '../types'
import { NavItem, NavItemDashboard } from './nav-item'
import { StyledSubheader, StyledMenu } from './styles'
import { useBoolean } from '../../../../../shared/hooks/use-boolean'
import { useActiveLink } from '../../../../routes/hook'

type NavListProps = {
  item: NavItemProps
  offsetTop: boolean
}

export default function NavList({ item, offsetTop }: NavListProps) {
  const pathname = usePathname()

  const nav = useBoolean()

  const { path, children } = item

  const active = useActiveLink(path, false)

  const externalLink = path.includes('http')

  useEffect(() => {
    if (nav.value) {
      nav.onFalse()
    }
  }, [pathname])

  const handleOpenMenu = () => {
    if (children) {
      nav.onTrue()
    }
  }

  return (
    <>
      <NavItem
        item={item}
        offsetTop={offsetTop}
        active={active}
        open={nav.value}
        externalLink={externalLink}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={nav.onFalse}
      />

      {!!children && nav.value && (
        <Portal>
          <Fade in={nav.value}>
            <StyledMenu
              onMouseEnter={handleOpenMenu}
              onMouseLeave={nav.onFalse}
              sx={{ display: 'flex' }}
            >
              {children.map((list) => (
                <NavSubList
                  key={list.subheader}
                  subheader={list.subheader}
                  items={list.items}
                  isDashboard={list.subheader === 'Dashboard'}
                  onClose={nav.onFalse}
                />
              ))}
            </StyledMenu>
          </Fade>
        </Portal>
      )}
    </>
  )
}

// ----------------------------------------------------------------------

type NavSubListProps = {
  isDashboard: boolean
  subheader: string
  items: NavItemProps[]
  onClose: VoidFunction
}

const NavSubList = ({
  items,
  isDashboard,
  subheader,
  onClose,
}: NavSubListProps) => {
  const pathname = usePathname()

  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      sx={{
        flexGrow: 1,
        ...(isDashboard && {
          maxWidth: 540,
        }),
      }}
    >
      <StyledSubheader disableSticky>{subheader}</StyledSubheader>

      {items.map((item) =>
        isDashboard ? (
          <NavItemDashboard key={item.title} item={item} onClick={onClose} />
        ) : (
          <NavItem
            subItem
            key={item.title}
            item={item}
            active={pathname === `${item.path}/`}
            onClick={onClose}
          />
        ),
      )}
    </Stack>
  )
}
