export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const PARAM_TO_REPLACE = ':id'
export const QUERY_PARAM_TO_REPLACE = '?id='

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RECOVER_PASSWORD: '/auth/forgot-password',
    NEW_PASSWORD: '/auth/new-password',
    RESEND_EMAIL: '/auth/resend-activation-email',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_FILTERS: `/users/filter`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: '/users/:id',
    CREATE: '/users',
  },
  MODULES: {
    GET_ALL: '/modules',
    GET_ONE: '/modules/:id',
    UPDATE: '/modules/:id',
    DELETE: '/modules/:id',
  },
  ATTENDANCE: {
    EDIT_CREATE_DEFAULT_MEMBERS_BY_MODULE_ID: (moduleId: number) =>
      `/attendance/default/${moduleId}`,
    GET_DEFAULT_MEMBERS_BY_MODULE_ID: (moduleId: number) =>
      `/attendance/default/${moduleId}`,
  },
  CAREERS: {
    CREATE: '/careers',
    GET_ALL: '/careers',
    GET_ONE: '/careers/:id',
    UPDATE: '/careers',
    DELETE: '/careers/:id',
  },
  STUDENTS: {
    GET_ALL: '/students',
    GET_BY_FILTERS: `/students/filter`,
    UPDATE: (id: number) => `/students/${id}`,
    BULK_UPDATE: (update: boolean, createdBy: number) =>
      `/students/bulk?update=${update}&created_by=${createdBy}`,
    DELETE: (id: number) => `/students/${id}`,
    CREATE: '/students',
    CREATE_MANY: '/students/bulk',
    GET_BY_ID: (id: number) => `/students/${id}`,
  },
  FUNCTIONARIES: {
    GET_ALL: '/functionaries',
    GET_BY_FILTERS: `/functionaries/filter`,
    UPDATE: (id: number) => `/functionaries/${id}`,
    BULK_UPDATE: '/functionaries/bulk',
    DELETE: '/functionaries/:id',
    CREATE: '/functionaries',
  },
  PROCESSES: {
    GET_ALL: '/processes',
    GET_ONE: '/processes/:id',
    GET_BY_FILTERS: `/processes/filter`,
    UPDATE: '/processes/:id',
    DELETE: '/processes/:id',
    CREATE: '/processes',
    GET_BY_MODULE: '/processes',
  },
  COUNCILS: {
    GET_ALL: '/councils',
    GET_BY_FILTERS: `/councils/filter/f`,
    GET_COUNT: '/councils/count',
    UPDATE: (id: number) => `/councils/${id}`,
    DELETE: '/councils/:id',
    CREATE: '/councils',
    BULK_UPDATE: '/councils/bulk',
    NOTIFY_MEMBERS: (id: number) => `/councils/${id}/notify-members`,
    GET_BY_ID: (id: number) => `/councils/${id}`,
    GET_NEXT_NUMBER_AVAILABLE: (moduleId: number) =>
      `/numeration-document/next-to-register/${moduleId}`,
    GET_COUNCILS_THAT_CAN_RESERVE: (moduleId: number) =>
      `/numeration-document/could-reserve/${moduleId}`,
    RESERVE_NUMERATION: `/numeration-document/reserve`,
    GET_AVAILABLE_EXTENSION_NUMERATION: (councilId: number) =>
      `/numeration-document/available-extension-numeration/${councilId}`,
    SET_ATTENDANCE: (memberId: number) => `/attendance/${memberId}`,
  },
  TEMPLATES: {
    GET_ALL: '/templates',
    GET_ONE: '/templates/:field',
    UPDATE: '/templates/:id',
    DELETE: '/templates/:id',
    CREATE: '/templates',
    GET_BY_PROCESS_ID: (id: number) => `/templates/process/${id}`,
    GET_BY_PROCESS_AND_FIELD: (processId: number, field: string) =>
      `/templates/process/${processId}/${field}`,
  },
  DOCUMENTS: {
    GET_ALL: '/documents',
    GET_ONE: '/documents/:id',
    UPDATE: (id: number) => `/documents/${id}`,
    DELETE: '/documents/:id',
    CREATE: '/documents',
    PROCESS: (id: number) => `/documents/create-recopilation/content/${id}`,
    GENERATE_RECORD: (id: number) => `/documents/create-recopilation/${id}`,
    DOWNLOAD: (id: number) => `/documents/create-recopilation/${id}`,
    GET_BY_STUDENT: (studentId: number) => `/documents/student/${studentId}`,
  },
  DOCUMENT_NUMERATION: {
    GET_BY_COUNCIL: '/numeration-document/by-council',
  },
  POSITIONS: {
    GET_ALL: '/positions',
    GET_BY_FIELD: (field: string) => `/positions/filter/${field}`,
    UPDATE: (id: number) => `/positions/${id}`,
    DELETE: (id: number) => `/positions/${id}`,
    DELETE_MANY: '/positions/delete/bulk',
    CREATE: '/positions',
  },
  DEGREE_CERTIFICATES: {
    GET_BY_FILTERS: `/degree-certificates/filter`,
    CREATE: '/degree-certificates',
    CHECK_PRESENTATION_DATE: `/degree-certificates/check-presentation-date`,
    GET_ALL: `/degree-certificates`,
    UPDATE: (id: number) => `/degree-certificates/${id}`,
    DELETE: (id: number) => `/degree-certificates/${id}`,
    GENERATE_NUMERATION: (careerId: number) =>
      `/degree-certificates/numeration/generate/${careerId}`,
    GET_LAST_NUMBER_TO_REGISTER: (careerId: number) =>
      `/degree-certificates/numeration/last-number-to-register/${careerId}`,
    GENERATE_DOCUMENT: (degreeCertificateId: number) =>
      `/degree-certificates/generate-document/${degreeCertificateId}`,
    GET: (id: number) => `/degree-certificates/get-one/${id}`,
    UPDATE_ATTENDANCE: (id: number) => `/degree-certificate-attendance/${id}`,
    BULK_LOAD: (userId: number) => `/degree-certificates/bulk/load/${userId}`,
    CREATE_ATTENDANCE: `/degree-certificate-attendance`,
    REPORTS: `/degree-certificates/reports`,
    DOWNLOAD: `/degree-certificates/reports/generate`,
    GET_ATTENDANCE: (degreeCertificateId: number) =>
      `/degree-certificate-attendance/${degreeCertificateId}`,
    DELETE_ATTENDANCE: (id: number) => `/degree-certificate-attendance/${id}`,
    GET_ENQUEUED_NUMBERS: (careerID: number) =>
      `/degree-certificates/numeration/enqueued/${careerID}`,
  },
  DEGREE_CERTIFICATE_TEMPLATES: {
    GET_ALL:
      'degree-certificates/certificate-types/certificate-type-status-career',
    GET_CELL_GRADES: (certificateTypeId: number) =>
      `/degree-certificates/grade-cells/by-certificate-type/${certificateTypeId}`,
    CREATE_CELL_GRADE: '/degree-certificates/grade-cells',
    DELETE_CELL_GRADE: (gradeId: number) =>
      `/degree-certificates/grade-cells/${gradeId}`,
  },
  CERTIFICATES_TYPES: {
    GET_ALL: '/degree-certificates/certificate-types',
  },
  CERTIFICATES_STATUS: {
    GET_ALL: '/degree-certificates/certificate-status',
  },
  DEGREE_MODALITIES: {
    GET_ALL: '/degree-certificates/degree-modalities',
  },
  DEGREES: {
    GET_ALL: '/degrees',
  },
  LOCATION_PROVIDER: {
    GET_ALL_PROVINCES: '/cities/provinces',
    GET_ALL_CITIES: '/cities',
  },
  ROOMS: {
    GET_ALL: '/degree-certificates/rooms',
  },
  VARIABLES: {
    GET_ALL: '/variables',
  },
}
