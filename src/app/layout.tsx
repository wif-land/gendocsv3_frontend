/* eslint-disable import/no-unresolved */
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import { Providers } from './providers'
// import 'react-toastify/dist/ReactToastify.css'
// import { ToastContainer } from 'react-toastify'
// import { ModulesProvider } from './providers/modules-provider'
// import ThemeProvider from '../core/theme'
// import LoaderView from '../shared/components/LoaderView'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Gestión Documental V3',
//   description: 'Generado por WifLand',
// }

// const RootLayout = ({ children }: { children: React.ReactNode }) => (
//   <html lang="en">
//     <body className={inter.className}>
//       <ToastContainer />
//       <LoaderView />

//       <Providers>
//         <ThemeProvider>
//           <ModulesProvider>
//             <main>{children}</main>
//           </ModulesProvider>
//         </ThemeProvider>
//       </Providers>
//     </body>
//   </html>
// )

// export default RootLayout

import 'simplebar-react/dist/simplebar.min.css'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import 'react-quill/dist/quill.snow.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { SettingsDrawer, SettingsProvider } from '../shared/components/settings'
import ThemeProvider from '../core/theme'
import MotionLazy from '../shared/components/animate/motion-lazy'
import { SnackbarProvider } from '../shared/components/snackbar'
import ProgressBar from '../shared/components/progress-bar/progress-bar'
import { ModulesProvider } from './providers/modules-provider'
import { primaryFont } from '../core/theme/typography'

export const metadata = {
  title: 'Gendocs V3 - Gestión Documental',
  description:
    'Gendocs V3 es una aplicación de gestión documental para la administración de documentos de la facultad.',
  keywords: 'react,material,kit,application,dashboard,admin,template',
  themeColor: '#000000',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <ModulesProvider>
                <SnackbarProvider>
                  <SettingsDrawer />
                  <ProgressBar />

                  {children}
                </SnackbarProvider>
              </ModulesProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
