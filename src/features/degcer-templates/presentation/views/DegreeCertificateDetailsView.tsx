// 'use client'

// import { memo, useCallback, useState } from 'react'
// import Tab from '@mui/material/Tab'
// import Container from '@mui/material/Container'
// import { useParams } from 'next/navigation'
// import { useSettingsContext } from '../../../../shared/sdk/settings'
// import Iconify from '../../../../core/iconify'
// import { Tabs } from '@mui/material'
// import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
// import { CouncilDetailsSummary } from '../components/DegreeCertificateDetailSummary'
// import { DegreeCertificateModel } from '../../data/DegreeCertificateModel'

// const CouncilDetailsView = () => {
//   const { id } = useParams()
//   const settings = useSettingsContext()
//   const { degreeCertificates } = useDegreeCertificateStote()

//   const [currentTab, setCurrentTab] = useState('general')

//   const handleChangeTab = useCallback(
//     (event: React.SyntheticEvent, newValue: string) => {
//       setCurrentTab(newValue)
//     },
//     [],
//   )

//   const council: DegreeCertificateModel | undefined = degreeCertificates.find(
//     (degreeCertificate) => degreeCertificates.id! === +id,
//   )

//   const TABS = [
//     {
//       value: 'general',
//       label: 'General',
//       icon: <Iconify icon="solar:user-id-bold" width={24} />,
//     },
//   ]

//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
//       <CustomBreadcrumbs
//         heading="Consejo"
//         links={[
//           { name: 'Dashboard', href: '/' },
//           { name: 'Consejo', href: '/' },
//           { name: degreeCertificates?.name || 'Cargando...' },
//         ]}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       />

//       <Tabs
//         value={currentTab}
//         onChange={handleChangeTab}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       >
//         {TABS.map((tab) => (
//           <Tab
//             key={tab.value}
//             label={tab.label}
//             icon={tab.icon}
//             value={tab.value}
//           />
//         ))}
//       </Tabs>

//       {currentTab === 'general' && (
//         <CouncilDetailsSummary
//           council={council as DegreeCertificateModel}
//           councilId={Number(id)}
//         />
//       )}
//     </Container>
//   )
// }

// export default memo(CouncilDetailsView)
