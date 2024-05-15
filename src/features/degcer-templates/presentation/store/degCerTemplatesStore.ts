import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'

interface StoreState {
  degCerTemplates: DegCerTemplateModel[]
  setDegCerTemplates: (degCerTemplates: DegCerTemplateModel[]) => void
}

const STORE_NAME = 'degree-certificates-templates-store'

const DEFAULT_DEGREE_CERTIFICATES_TEMPLATES: DegCerTemplateModel[] = []

export const useDegreeCertificatesStore = create<StoreState>(
  persist(
    (set) => ({
      degCerTemplates: DEFAULT_DEGREE_CERTIFICATES_TEMPLATES,
      setDegCerTemplates: (degCerTemplates) => set({ degCerTemplates }),
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
