import { create } from 'zustand'

interface ILoaderStore {
  loader: string[]
  addLoaderItem: (item: string) => void
  removeLoaderItem: (item: string) => void
}

const useLoaderStore = create<ILoaderStore>((set) => ({
  loader: [],
  addLoaderItem: (item) =>
    set((state) => ({ loader: [...state.loader, item] })),
  removeLoaderItem: (item) =>
    set((state) => ({ loader: state.loader.filter((i) => i !== item) })),
}))

export default useLoaderStore
