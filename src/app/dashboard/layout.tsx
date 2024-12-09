'use client'

import React from 'react'
import DashboardLayout from '../../core/layout/dashboard/layout'
import { CareerProvider } from '../../core/providers/career-provider'
import { LocationProvider } from '../../core/providers/locations-provider'
import { DegreeProvider } from '../../core/providers/functionary-degree-provider'
import { CertificateProvider } from '../../core/providers/certificate-degree-provider'

interface LayoutProps {
  children: React.ReactNode
}
const layout: React.FC<LayoutProps> = ({ children }) => (
  <DashboardLayout>
    <CareerProvider>
      <LocationProvider>
        <DegreeProvider>
          <CertificateProvider>{children}</CertificateProvider>
        </DegreeProvider>
      </LocationProvider>
    </CareerProvider>
  </DashboardLayout>
)

export default layout
