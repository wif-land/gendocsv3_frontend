export interface IModule {
  id: number
  code: string
  name: string
  compilationTemplateDriveId?: string
  separatorTemplateDriveId?: string
  submodules: { id: number; name: string }[]
}
