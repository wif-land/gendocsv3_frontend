import { memo } from 'react'

import Stack from '@mui/material/Stack'
// theme
//
import { NavSectionProps, NavListProps, NavConfigProps } from '../types'
import { navHorizontalConfig } from '../config'
import NavList from './nav-list'
import { hideScroll } from '../../../../core/theme/css'

const NavSectionHorizontal = ({
  data,
  config,
  sx,
  ...other
}: NavSectionProps) => (
  <Stack
    direction="row"
    sx={{
      mx: 'auto',
      ...hideScroll.y,
      ...sx,
    }}
    {...other}
  >
    {data.map((group, index) => (
      <Group
        key={group.subheader || index}
        items={group.items}
        config={navHorizontalConfig(config)}
      />
    ))}
  </Stack>
)

export default memo(NavSectionHorizontal)

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
