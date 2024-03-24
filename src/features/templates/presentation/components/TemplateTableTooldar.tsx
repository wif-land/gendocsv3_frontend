import { useEffect, useState } from 'react'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Iconify from '../../../../core/iconify'

import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { TableProps } from '../../../../shared/sdk/table/types'

export type ITemplateTableFilterValue = string | string[]

export type ITemplateTableFilters = {
  name: string
}

type Props = {
  setSearchTerm: (value: string) => void
  filters: ITemplateTableFilters
  table: TableProps
  setDataTable: (value: TemplateModel[]) => void
}

export const TemplateTableToolbar = ({
  setSearchTerm,
  filters = { name: '' },
  table,
  setDataTable,
}: Props) => {
  const [inputValue, setInputValue] = useState('' as string)
  const debouncedValue = useDebounce(inputValue)

  const resetValues = () => {
    setDataTable([])
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    table.setPage(0)

    if (inputValue) {
      setSearchTerm(inputValue)
    } else {
      resetValues()
    }
  }, [debouncedValue])

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
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Busca por nombre de proceso"
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
