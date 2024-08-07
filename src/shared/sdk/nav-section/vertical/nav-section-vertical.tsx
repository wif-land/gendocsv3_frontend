import { memo, useState, useCallback } from 'react'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Collapse from '@mui/material/Collapse'
import { NavSectionProps, NavListProps, NavConfigProps } from '../types'
import { navVerticalConfig } from '../config'
import { StyledHeader, StyledSubheader } from './styles'

import NavList from './nav-list'

const NavSectionVertical = ({
  data,
  config,
  sx,
  ...other
}: NavSectionProps) => (
  <Stack sx={sx} {...other}>
    {data.map((group, index) => (
      <Group
        header={group.header}
        key={group.subheader || index}
        subheader={group.subheader}
        items={group.items}
        config={navVerticalConfig(config)}
      />
    ))}
  </Stack>
)

export default memo(NavSectionVertical)

type GroupProps = {
  header?: string
  subheader: string
  items: NavListProps[]
  config: NavConfigProps
}

const Group = ({ subheader, items, config, header }: GroupProps) => {
  const [open, setOpen] = useState(true)

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const renderContent = items.map((list) => (
    <NavList
      key={list.title + list.path}
      data={list}
      depth={1}
      hasChild={!!list.children}
      config={config}
    />
  ))

  return (
    <List disablePadding sx={{ px: 2 }}>
      {header && <StyledHeader>{header}</StyledHeader>}
      {subheader ? (
        <>
          <StyledSubheader
            disableGutters
            disableSticky
            onClick={handleToggle}
            config={config}
          >
            {subheader}
          </StyledSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </List>
  )
}
