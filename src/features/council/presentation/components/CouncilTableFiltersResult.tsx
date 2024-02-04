import Box from '@mui/material/Box'
// import Chip from '@mui/material/Chip'
// import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Stack, { StackProps } from '@mui/material/Stack'
import {
  ICouncilTableFilterValue,
  ICouncilTableFilters,
} from './CouncilTableToolbar'
import Iconify from '../../../../core/iconify'
// import { useCouncilStore } from '../store/councilsStore'
// import { CouncilModel } from '../../data/models/CouncilModel'

type Props = StackProps & {
  filters: ICouncilTableFilters
  onFilters: (name: string, value: ICouncilTableFilterValue) => void
  onResetFilters: VoidFunction
  results: number
}

export const CouncilTableFiltersResult = ({
  // filters,
  // onFilters,
  onResetFilters,
  results,
  ...other
  // eslint-disable-next-line arrow-body-style
}: Props) => {
  // const { councils } = useCouncilStore()
  // let filteredCouncils: CouncilModel[] = []

  // const handleRemovePublish = (inputValue: string) => {
  //   filteredCouncils = councils.filter((item) => item.name !== inputValue)
  //   onFilters('name', filteredCouncils[0].name)
  // }

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {/* {!!filteredCouncils.length && (
          <Block label="Publish:">
            {filteredCouncils.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                size="small"
                // onDelete={() => handleRemovePublish(item.name)}
              />
            ))}
          </Block>
        )} */}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  )
}

// type BlockProps = StackProps & {
//   label: string
// }

// const Block = ({ label, children, sx, ...other }: BlockProps) => (
//   <Stack
//     component={Paper}
//     variant="outlined"
//     spacing={1}
//     direction="row"
//     sx={{
//       p: 1,
//       borderRadius: 1,
//       overflow: 'hidden',
//       borderStyle: 'dashed',
//       ...sx,
//     }}
//     {...other}
//   >
//     <Box component="span" sx={{ typography: 'subtitle2' }}>
//       {label}
//     </Box>

//     <Stack spacing={1} direction="row" flexWrap="wrap">
//       {children}
//     </Stack>
//   </Stack>
// )
