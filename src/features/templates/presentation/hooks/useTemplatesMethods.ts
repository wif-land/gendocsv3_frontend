import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { enqueueSnackbar } from 'notistack'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { useState } from 'react'
import { TemplatesUseCasesImpl } from '../../domain/usecases/TemplateServices'
import { ITemplate } from '../../domain/entities/ITemplate'

export const useTemplatesMethods = () => {
  const [templates, setTemplates] = useState<TemplateModel[]>([])
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (processId: number) => {
    addLoaderItem('templates')
    try {
      const response =
        await TemplatesUseCasesImpl.getInstance().getTemplatesByProcessId(
          processId,
        )

      return response
    } catch (error) {
      enqueueSnackbar('No encontramos plantillas', {
        variant: 'info',
      })
      return {
        templates: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('templates')
    }
  }

  const updateRow = async (template: Partial<ITemplate>) => {
    addLoaderItem('templates')
    try {
      const response = await TemplatesUseCasesImpl.getInstance().update(
        template.id as number,
        {
          isActive: !template.isActive,
        },
      )
      return response
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('template')
    }
  }

  const fetchDataByField = async (searchTerm: string, processId: number) => {
    addLoaderItem('templates')
    try {
      const response =
        await TemplatesUseCasesImpl.getInstance().getTemplatesByProcessAndField(
          processId,
          searchTerm,
        )

      return {
        status: 200,
        data: response,
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          templates: [],
        },
      }
    } finally {
      removeLoaderItem('templates')
    }
  }

  return {
    loader,
    templates,
    setTeemplates: setTemplates,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
