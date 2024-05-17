import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Iconify from '../../../../core/iconify'
import { usePopover } from '../../../../shared/sdk/custom-popover'
import CustomPopover from '../../../../shared/sdk/custom-popover/custom-popover'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { TableProps } from '../../../../shared/sdk/table'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { useCareersStore } from '../../../../features/careers/presentation/store/careerStore'
import { CareerFilter } from '../../../../shared/sdk/filters/career-filter'
import { SelectChangeEvent } from '@mui/material'

export type IDegreeCertificateTableFilterValue = string | string[]

export type IDegreeCertificateTableFilters = {
  name: string
  career: number
}

type Props = {
  filters: IDegreeCertificateTableFilters
  onFilters: (name: string, value: IDegreeCertificateTableFilterValue) => void
  setVisitedPages: (value: number[]) => void
  setIsDataFiltered: (value: boolean) => void
  isDataFiltered: boolean
  table: TableProps
  setDataTable: (value: DegreeCertificateModel[]) => void
  getFilteredCouncils: (field: string) => void
}

export const DegreeCertificatesTableToolbar = ({
  filters,
  onFilters,
  setVisitedPages,
  isDataFiltered,
  setIsDataFiltered,
  table,
  setDataTable,
  getFilteredCouncils,
}: Props) => {
  const popover = usePopover()
  const [inputValue, setInputValue] = useState(undefined as string | undefined)
  const debouncedValue = useDebounce(inputValue ? inputValue : '')
  const { careers } = useCareersStore()

  const resetValues = () => {
    setVisitedPages([])
    setDataTable([])
    setIsDataFiltered(false)
  }

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    !isDataFiltered && setIsDataFiltered(true)
    onFilters('name', event.target.value)
  }

  // useEffect(() => {
  //   let isMounted = true

  //   if (!isMounted) return

  //   table.setPage(0)
  //   setVisitedPages([])

  //   areFiltersAdded() === true
  //     ? getFilteredCouncils(filters.name)
  //     : resetValues()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [debouncedValue, filters.name])

  // const areFiltersAdded = () =>
  //   (inputValue !== undefined && inputValue !== '') ||
  //   filters.name !== undefined

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    !isDataFiltered && setIsDataFiltered(true)

    onFilters('career', value)
  }

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
          pr: { xs: 2.5, md: 2.5 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1, display: 'flex', flexDirection: 'row' }}
        >
          <CareerFilter
            filters={filters}
            onChange={handleChange}
            sx={{ width: 700 }}
          />
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Busca por nombre de acta"
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
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </Stack>
    </>
  )
}
