'use client'

import React from 'react'
import DashboardLayout from '../../core/layout/dashboard/layout'

interface LayoutProps {
  children: React.ReactNode
}
const layout: React.FC<LayoutProps> = ({ children }) => (
  <DashboardLayout>{children}</DashboardLayout>
)

export default layout
