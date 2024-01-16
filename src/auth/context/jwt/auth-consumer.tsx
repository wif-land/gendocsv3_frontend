'use client'

import { SplashScreen } from '../../../shared/components/loading-screen'
import { AuthContext } from './auth-context'

type Props = {
  children: React.ReactNode
}

export const AuthConsumer = ({ children }: Props) => (
  <AuthContext.Consumer>
    {(auth) => (auth.loading ? <SplashScreen /> : children)}
  </AuthContext.Consumer>
)
