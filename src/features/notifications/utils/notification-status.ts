export enum NotificationStatus {
  IN_PROGRESS = 'EN_PROGRESO',
  COMPLETED = 'COMPLETO',
  WITH_ERRORS = 'CON_ERRORES',
  FAILURE = 'FALLIDO',
}

export const notificationStatusColor = (status: NotificationStatus) => {
  switch (status) {
    case NotificationStatus.COMPLETED:
      return 'success'
    case NotificationStatus.WITH_ERRORS:
      return 'warning'
    case NotificationStatus.IN_PROGRESS:
      return 'info'
    case NotificationStatus.FAILURE:
      return 'error'
    default:
      return 'default'
  }
}
