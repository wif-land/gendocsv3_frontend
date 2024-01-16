import { TextareaAutosize } from '@mui/material'

type Props = {
  description: string
}

export default function ProductDetailsDescription({ description }: Props) {
  return (
    <TextareaAutosize
      sx={{
        p: 3,
        '& p, li, ol': {
          typography: 'body2',
        },
        '& ol': {
          p: 0,
          display: { md: 'flex' },
          listStyleType: 'none',
          '& li': {
            '&:first-of-type': {
              minWidth: 240,
              mb: { xs: 0.5, md: 0 },
            },
          },
        },
      }}
    />
  )
}
