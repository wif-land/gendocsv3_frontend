'use client'

import React from 'react'
import DashboardLayout from '../../core/layout/dashboard/layout'
import { LocationProvider } from '../../core/providers/locations-provider'

interface LayoutProps {
  children: React.ReactNode
}
const layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <LocationProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LocationProvider>
    {/*
      <Suspense fallback={<LoadingScreen />}>
        <PrivateRoute>
          <div className="h-screen flex">
            <nav className="fixed top-0 z-50 py-5 w-full bg-red-800 flex justify-end items-center px-10">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: 'mx-10',
                  icon: 'text-black/80',
                }}
              />

              <div
                className="text-white font-sm cursor-pointer hover:text-black/80 duration-100 transition-colors px-2 text-center"
                onClick={logout}
              >
                Cerrar sesión
              </div>
            </nav>

            <div className="flex mt-20 h-full w-full">
              <aside className="max-w-fit bg-white h-full overflow-x-auto px-3">
                <ScrollShadow hideScrollBar className="h-full overflow-auto">
                  <ul>
                    <CareerModule />
                  </ul>
                </ScrollShadow>
              </aside>

              <Divider orientation="vertical" />
              <section className="flex-grow p-4">{children}</section>
            </div>
          </div>
        </PrivateRoute>
      </Suspense> */}
  </div>
)

export default layout
