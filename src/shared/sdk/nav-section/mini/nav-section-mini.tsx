import { memo } from 'react'
import Stack from '@mui/material/Stack'
//
import { NavSectionProps, NavListProps, NavConfigProps } from '../types'
import { navMiniConfig } from '../config'
import NavList from './nav-list'

const NavSectionMini = ({ data, config, sx, ...other }: NavSectionProps) => (
  <Stack sx={sx} {...other}>
    {data.map((group, index) => (
      <Group
        key={group.subheader || index}
        items={group.items}
        config={navMiniConfig(config)}
      />
    ))}
  </Stack>
)

export default memo(NavSectionMini)

type GroupProps = {
  items: NavListProps[]
  config: NavConfigProps
}

const Group = ({ items, config }: GroupProps) => (
  <>
    {items.map((list) => (
      <NavList
        key={list.title + list.path}
        data={list}
        depth={1}
        hasChild={!!list.children}
        config={config}
      />
    ))}
  </>
)
