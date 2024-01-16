import { MuiOtpInput, MuiOtpInputProps } from 'mui-one-time-password-input'

type RHFCodesProps = MuiOtpInputProps & {
  name: string
}

export default function RHFCode({ ...other }: RHFCodesProps) {
  return (
    <div>
      <MuiOtpInput
        autoFocus
        gap={1.5}
        length={6}
        TextFieldsProps={{
          placeholder: '-',
        }}
        {...other}
      />
    </div>
  )
}
