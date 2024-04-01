import { useEffect, useState } from 'react'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Iconify from '../../../../core/iconify'

import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TemplateModel } from '../../data/models/TemplatesModel'

export type ITemplateTableFilterValue = string | string[]

export type ITemplateTableFilters = {
  name: string
}

type Props = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  setDataTable: (value: TemplateModel[]) => void
  getFilteredTemplates: (field: string) => void
  setIsDataFiltered: (value: boolean) => void
}

export const TemplateTableToolbar = ({
  searchTerm,
  setSearchTerm,
  setDataTable,
  setIsDataFiltered,
  getFilteredTemplates,
}: Props) => {
  const [inputValue, setInputValue] = useState(searchTerm)
  const debouncedValue = useDebounce(inputValue)

  const resetValues = () => {
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    if (inputValue && inputValue !== '') {
      setIsDataFiltered(true)
      setSearchTerm(inputValue)
      getFilteredTemplates(debouncedValue)
    } else {
      resetValues()
    }
    return () => {
      isMounted = false
    }
  }, [debouncedValue])

  useEffect(() => {
    let isMounted = true

    if (!isMounted) return

    if (searchTerm === '') {
      setInputValue('')
    }

    return () => {
      isMounted = false
    }
  }, [searchTerm])

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={inputValue}
            onChange={handleFilterName}
            placeholder="Busca por nombre de plantilla"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  )
}
