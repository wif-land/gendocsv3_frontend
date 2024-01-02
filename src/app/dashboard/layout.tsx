'use client'

import { Avatar, AvatarIcon, ScrollShadow, Divider } from '@nextui-org/react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import CareerModule from '../../shared/components/CareerModule'
import React, { Suspense } from 'react'

interface LayoutProps {
  children: React.ReactNode
}
const layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth()
  const PrivateRoute = React.lazy(
    () => import('../../shared/components/PrivateRoute'),
  )

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute>
          <div className="h-screen flex">
            <nav className="fixed top-0 z-50 h-20 w-full bg-red-800 flex items-center">
              <div className="w-full flex justify-end">
                <Avatar
                  icon={<AvatarIcon />}
                  classNames={{
                    base: 'bg-gradient-to-br from-[#FFB457] to-[#FF705B] m-10',
                    icon: 'text-black/80',
                  }}
                />
              </div>
              <div className="text-black" onClick={logout}>
                Cerrar sesión
              </div>
            </nav>
            <div className="flex mt-20 h-full w-full">
              <aside className="w-56 bg-white h-full overflow-x-auto">
                <ScrollShadow hideScrollBar className="h-full overflow-auto">
                  <ul>
                    <CareerModule items={''} />
                  </ul>
                </ScrollShadow>
              </aside>
              <Divider orientation="vertical" />
              <section className="flex-grow p-4">{children}</section>
            </div>
          </div>
        </PrivateRoute>
      </Suspense>
    </div>
  )
}

export default layout
