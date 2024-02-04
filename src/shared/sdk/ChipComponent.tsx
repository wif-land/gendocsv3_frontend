import { Chip } from '@mui/material'

export interface ChipComponentProps {
  color: 'primary' | 'secondary'
  label: string
}

export const ChipComponent = ({ color, label }: ChipComponentProps) => (
  <Chip label={label} color={color} />
)
