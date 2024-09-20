import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { useState } from 'react'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { ITemplate } from '../../domain/entities/ITemplate'

export const useTemplatesMethods = () => {
  const [templates, setTemplates] = useState<TemplateModel[]>([])
  const { loader } = useLoaderStore()

  const fetchData = async (processId: number) =>
    await TemplatesUseCasesImpl.getInstance().getTemplatesByProcessId(processId)

  const updateRow = async (template: Partial<ITemplate>) =>
    await TemplatesUseCasesImpl.getInstance().update(template.id as number, {
      isActive: !template.isActive,
    })

  const fetchDataByField = async (searchTerm: string, processId: number) =>
    await TemplatesUseCasesImpl.getInstance().getTemplatesByProcessAndField(
      processId,
      searchTerm,
    )

  const migrateToNewProcess = async (
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) =>
    await TemplatesUseCasesImpl.getInstance().migrateToNewProcess(
      templateIds,
      userId,
      moduleId,
      processValue,
    )

  return {
    loader,
    templates,
    setTeemplates: setTemplates,
    fetchData,
    updateRow,
    fetchDataByField,
    migrateToNewProcess,
  }
}
