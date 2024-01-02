'use client'

import { NextUIProvider as N } from '@nextui-org/react'

interface IProviders {
  children: React.ReactNode
}

export const Providers = (data: IProviders) => <N>{data.children}</N>
