'use client'

import { m } from 'framer-motion'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { usePopover } from '../../../shared/sdk/custom-popover'
import { varHover } from '../../../shared/sdk/animate'
import CustomPopover from '../../../shared/sdk/custom-popover/custom-popover'
import { useAuth } from '../../../features/auth/presentation/hooks/useAuth'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'
import { useEffect, useState } from 'react'
import { UserRole } from '@/features/users/domain/entities/IUser'
import { Button, Grid } from '@mui/material'
import NumerationResetDialog from './numeration-reset'

export default function AccountPopover() {
  const { user } = useAccountStore()
  const { handleLogout } = useAuth()
  const popover = usePopover()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    return () => {
      popover.onClose()
    }
  }, [])

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={''}
          alt={`${user?.firstName} ${user?.firstLastName}`}
          sx={{
            width: 36,
            height: 36,
            border: (theme: { palette: { background: { default: any } } }) =>
              `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 230, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.firstName} {user?.firstLastName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.googleEmail}
          </Typography>
        </Box>
        {user?.role === UserRole.ADMIN && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <MenuItem
                onClick={() => {
                  popover.onClose()
                  setOpen(true)
                }}
                sx={{ m: 1, fontWeight: 'fontWeightBold' }}
              >
                <Grid container spacing={1}>
                  <Typography variant="subtitle2" color={'GrayText'}>
                    {'(Administrador)'}
                  </Typography>
                  <Typography variant="body2" color={'GrayText'} noWrap>
                    {'Reinicio anual de numeración'}
                  </Typography>
                </Grid>
              </MenuItem>
            </Box>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Cerrar Sesión
        </MenuItem>
      </CustomPopover>
      <NumerationResetDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
