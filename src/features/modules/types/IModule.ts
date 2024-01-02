export interface IModule {
  id: number
  code: string
  name: string
  submodules: { id: number; name: string }[]
}
