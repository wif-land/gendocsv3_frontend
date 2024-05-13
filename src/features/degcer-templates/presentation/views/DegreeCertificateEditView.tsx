// 'use client'

// import Container from '@mui/material/Container'
// import { useSettingsContext } from '../../../../shared/sdk/settings'
// import { useParams, usePathname } from 'next/navigation'
// import { useCouncilStore } from '../store/councilsStore'
// import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
// import { paths } from '../../../../core/routes/paths'
// import { CouncilNewEditForm } from '../components/DegreeCertificateNewEditForm'
// import { memo } from 'react'

// const CouncilEditView = () => {
//   const settings = useSettingsContext()
//   const { id } = useParams()
//   const pathname = usePathname()
//   const { councils } = useCouncilStore()

//   const currentCouncil = councils.find((council) => council.id! === +id)

//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
//       <CustomBreadcrumbs
//         heading="Editar"
//         links={[
//           { name: 'Dashboard', href: paths.dashboard.root },
//           {
//             name: 'Consejos',
//             href: pathname.replace('/new', ''),
//           },
//           { name: currentCouncil?.name },
//         ]}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       />

//       <CouncilNewEditForm currentCouncil={currentCouncil} />
//     </Container>
//   )
// }

// export default memo(CouncilEditView)
