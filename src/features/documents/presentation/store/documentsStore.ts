import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DocumentModel } from '../../data/models/DocumentsModel'

interface StoreState {
  documents: DocumentModel[]
  setDocuments: (documents: DocumentModel[]) => void
  isLoading: boolean
}

const STORE_NAME = 'documents-store'
const DEFAULT_DOCUMENTS: DocumentModel[] = []

export const useDocumentStore = create<StoreState>(
  persist(
    (set) => ({
      isLoading: false,
      documents: DEFAULT_DOCUMENTS,
      setDocuments: (documents) => {
        set({ isLoading: true })
        set({ documents })
        set({ isLoading: false })
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
