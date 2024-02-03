import Iconify, { IconifyProps } from '../iconify'
type Props = {
  icon?: IconifyProps
  isRTL?: boolean
}

export const LeftIcon = ({
  icon = 'eva:arrow-ios-forward-fill',
  isRTL,
}: Props) => (
  <Iconify
    icon={icon}
    sx={{
      transform: ' scaleX(-1)',
      ...(isRTL && {
        transform: ' scaleX(1)',
      }),
    }}
  />
)

export const RightIcon = ({
  icon = 'eva:arrow-ios-forward-fill',
  isRTL,
}: Props) => (
  <Iconify
    icon={icon}
    sx={{
      ...(isRTL && {
        transform: ' scaleX(-1)',
      }),
    }}
  />
)
