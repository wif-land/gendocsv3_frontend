'use client'

import { useEffect } from 'react'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { usePathname } from 'next/navigation'
import { NavProps } from '../types'
import NavList from './nav-list'
import { useBoolean } from '../../../../../shared/hooks/use-boolean'
import SvgColor from '../../../../../shared/sdk/svg-color'
import Scrollbar from '../../../../../shared/sdk/scrollbar'
import Logo from '../../../../../shared/sdk/logo'

export default function NavMobile({ offsetTop, data }: NavProps) {
  const pathname = usePathname()

  const nav = useBoolean()

  useEffect(() => {
    if (nav.value) {
      nav.onFalse()
    }
  }, [pathname])

  return (
    <>
      <IconButton
        onClick={nav.onTrue}
        sx={{
          ml: 1,
          ...(offsetTop && {
            color: 'text.primary',
          }),
        }}
      >
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={nav.value}
        onClose={nav.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          <List component="nav" disablePadding>
            {data.map((link) => (
              <NavList key={link.title} item={link} />
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  )
}
