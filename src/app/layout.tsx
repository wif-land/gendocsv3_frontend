import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ModulesProvider } from './providers/modules-provider'
import LoaderView from '../shared/components/LoaderView'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gestión Documental V3',
  description: 'Generado por WifLand',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <ToastContainer />
      <LoaderView />

      <Providers>
        <ModulesProvider>
          <main>{children}</main>
        </ModulesProvider>
      </Providers>
    </body>
  </html>
)

export default RootLayout
