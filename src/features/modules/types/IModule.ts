export interface IModule {
  id: number
  code: string
  name: string
  compilationTemplateDriveId?: string
  separatorTemplateDriveId?: string
  defaultTemplateDriveId?: string
  submodules: { id: number; name: string }[]
}
