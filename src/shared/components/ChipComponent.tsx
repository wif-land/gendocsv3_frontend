import { Chip, ChipProps } from '@nextui-org/react'

interface ChipComponentProps {
  color: ChipProps['color']
  label: string
}

export const ChipComponent = ({ color, label }: ChipComponentProps) => (
  <Chip className="capitalize" color={color} size="sm" variant="flat">
    {label}
  </Chip>
)
