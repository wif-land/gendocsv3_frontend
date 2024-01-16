import TextField from '@mui/material/TextField'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string
  label?: string
  placeholder?: string
  helperText?: React.ReactNode
}

export default function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  label,
  placeholder,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {
  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField label={label} placeholder={placeholder} {...params} />
      )}
      {...other}
    />
  )
}
