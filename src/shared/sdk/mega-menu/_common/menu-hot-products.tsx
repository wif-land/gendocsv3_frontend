import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MenuHotProductsProps } from '../types'
import { RouterLink } from '../../../../core/routes/components'
export default function MenuHotProducts({
  tags,
  ...other
}: MenuHotProductsProps) {
  return (
    <Box {...other}>
      <Typography
        variant="caption"
        sx={{
          mr: 0.5,
          fontWeight: 'fontWeightBold',
        }}
      >
        Hot Products:
      </Typography>

      {tags.map((tag, index) => (
        <Link
          key={tag.name}
          component={RouterLink}
          href={tag.path}
          underline="none"
          variant="caption"
          sx={{
            color: 'text.secondary',
            transition: (theme) => theme.transitions.create('all'),
            '&:hover': { color: 'primary.main' },
          }}
        >
          {index === 0 ? tag.name : `, ${tag.name} `}
        </Link>
      ))}
    </Box>
  )
}
