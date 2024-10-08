import { useState, useEffect, useRef } from 'react'
import Stack from '@mui/material/Stack'
import { appBarClasses } from '@mui/material/AppBar'
import Popover, { popoverClasses } from '@mui/material/Popover'
import { usePathname } from 'next/navigation'
import { NavListProps, NavConfigProps } from '../types'
import NavItem from './nav-item'
import { useActiveLink } from '../../../../core/routes/hook'

type NavListRootProps = {
  data: NavListProps
  depth: number
  hasChild: boolean
  config: NavConfigProps
}

export default function NavList({
  data,
  depth,
  hasChild,
  config,
}: NavListRootProps) {
  const navRef = useRef(null)

  const pathname = usePathname()

  const active = useActiveLink(data.path, hasChild)

  const externalLink = data.path.includes('http')

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      handleClose()
    }
  }, [pathname])

  useEffect(() => {
    const appBarEl = Array.from(
      document.querySelectorAll(`.${appBarClasses.root}`),
    ) as Array<HTMLElement>

    const styles = () => {
      document.body.style.overflow = ''
      document.body.style.padding = ''
      appBarEl.forEach((elem) => {
        elem.style.padding = ''
      })
    }

    if (open) {
      styles()
    } else {
      styles()
    }
  }, [open])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <NavItem
        ref={navRef}
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        config={config}
      />

      {hasChild && (
        <Popover
          open={open}
          anchorEl={navRef.current}
          anchorOrigin={
            depth === 1
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'right' }
          }
          transformOrigin={
            depth === 1
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'left' }
          }
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
          sx={{
            pointerEvents: 'none',
            [`& .${popoverClasses.paper}`]: {
              width: 160,
              ...(open && {
                pointerEvents: 'auto',
              }),
            },
          }}
        >
          <NavSubList data={data.children} depth={depth} config={config} />
        </Popover>
      )}
    </>
  )
}

type NavListSubProps = {
  data: NavListProps[]
  depth: number
  config: NavConfigProps
}

const NavSubList = ({ data, depth, config }: NavListSubProps) => (
  <Stack spacing={0.5}>
    {data.map((list) => (
      <NavList
        key={list.title + list.path}
        data={list}
        depth={depth + 1}
        hasChild={!!list.children}
        config={config}
      />
    ))}
  </Stack>
)
