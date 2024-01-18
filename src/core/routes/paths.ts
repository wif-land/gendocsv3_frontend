import { paramCase } from '../utils/change-case'

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
}

export const paths = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    // user: {
    //   root: `${ROOTS.DASHBOARD}/user`,
    //   new: `${ROOTS.DASHBOARD}/user/new`,
    //   list: `${ROOTS.DASHBOARD}/user/list`,
    //   cards: `${ROOTS.DASHBOARD}/user/cards`,
    //   profile: `${ROOTS.DASHBOARD}/user/profile`,
    //   account: `${ROOTS.DASHBOARD}/user/account`,
    //   edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    //   demo: {
    //     edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
    //   },
    // },
    // product: {
    //   root: `${ROOTS.DASHBOARD}/product`,
    //   new: `${ROOTS.DASHBOARD}/product/new`,
    //   details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
    //   edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
    //     edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
    //   },
    // },
  },
}
