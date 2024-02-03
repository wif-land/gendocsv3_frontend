'use client'

import dynamic from 'next/dynamic'
import { LazyMotion, m } from 'framer-motion'
const loadFeatures = () => import('./features.js').then((res) => res.default)

type Props = {
  children: React.ReactNode
}

const MotionLazy = ({ children }: Props) => (
  <LazyMotion strict features={loadFeatures}>
    <m.div style={{ height: '100%' }}> {children} </m.div>
  </LazyMotion>
)

export default dynamic(() => Promise.resolve(MotionLazy), { ssr: false })
