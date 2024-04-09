import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProcessModel } from '../../data/models/ProcessesModel'
import { TemplateModel } from '../../../templates/data/models/TemplatesModel'
import { ITemplate } from '../../../templates/domain/entities/ITemplate'

interface StoreState {
  processes: ProcessModel[]
  setProcesses: (processes: ProcessModel[]) => void
  isLoading: boolean
  addTemplateToProcess: (
    newTemplateData: TemplateModel,
    processId: number,
  ) => void
  updateTemplate: (
    processId: number,
    templateId: number,
    newTemplateData: Partial<TemplateModel>,
  ) => void
}

const STORE_NAME = 'processes-store'
const DEFAULT_PROCESSES: ProcessModel[] = []

export const useProcessStore = create<StoreState>(
  persist(
    (set, get) => ({
      isLoading: false,
      processes: DEFAULT_PROCESSES,
      setProcesses: (processes) => {
        set({ isLoading: true })
        set({ processes })
        set({ isLoading: false })
      },
      addTemplateToProcess: (newTemplateData, processId) => {
        let processes = get().processes
        const processIndex = processes.findIndex((p) => p.id === processId)

        if (processIndex === -1) {
          console.error('Proceso no encontrado')
          return
        }

        const newTemplate = { ...newTemplateData, processId }

        processes = processes.map((process, index) => {
          if (index === processIndex) {
            return {
              ...process,
              templateProcesses: [
                ...(process.templateProcesses || []),
                newTemplate,
              ],
              toJson: process.toJson,
            }
          }
          return process
        })

        set({ processes })
      },
      updateTemplate: (
        processId: number,
        templateId: number,
        updatedTemplateData: Partial<TemplateModel>,
      ) => {
        const processes = get().processes
        const processIndex = processes.findIndex((p) => p.id === processId)

        if (processIndex === -1) {
          console.error('Proceso no encontrado')
          return
        }

        const templates = processes[processIndex].templateProcesses
        if (!templates) {
          console.error('Plantillas no encontradas en el proceso')
          return
        }

        const templateIndex = templates.findIndex((t) => t.id === templateId)
        if (templateIndex === -1) {
          console.error('Plantilla no encontrada')
          return
        }

        console.log('templateData', updatedTemplateData)

        const updatedTemplate: ITemplate = { ...templates[templateIndex] }
        Object.keys(updatedTemplateData).forEach((key) => {
          const keyOfTemplate = key as keyof ITemplate
          const value = updatedTemplateData[keyOfTemplate]
          if (value !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(updatedTemplate as any)[keyOfTemplate] = value
          }
        })

        console.log('updatedTemplate', updatedTemplate)

        const updatedTemplates = templates.map((template, index) =>
          index === templateIndex ? updatedTemplate : template,
        )

        const updatedProcesses = processes.map((process, index) =>
          index === processIndex
            ? { ...process, templateProcesses: updatedTemplates }
            : process,
        )

        set({ processes: updatedProcesses as ProcessModel[] })
      },
    }),
    {
      name: STORE_NAME,
    },
  ) as StateCreator<StoreState>,
)
