import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { DocumentsDataSourceImpl } from '../../data/datasource/DocumentsDatasource'

interface StoreState {
  documents: DocumentModel[]
  setDocuments: (documents: DocumentModel[]) => void
  processDocuments: (id: number) => void
  generateRecord: (id: number) => void
  downloadDocument: (id: number) => void
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
      processDocuments: async (id) => {
        const { processDocuments } = DocumentsDataSourceImpl.getInstance()
        await processDocuments(id)
      },
      generateRecord: async (id: number) => {
        const { generateRecord } = DocumentsDataSourceImpl.getInstance()
        await generateRecord(id)
      },
      downloadDocument: async (id) => {
        const { downloadDocument } = DocumentsDataSourceImpl.getInstance()
        await downloadDocument(id).then((data) => {
          const { file, fileName } = data
          const byteCharacters = atob(file)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/msword' })

          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
