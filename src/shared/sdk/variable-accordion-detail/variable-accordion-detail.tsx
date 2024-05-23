import { AccordionDetails, Card, Stack } from '@mui/material'
import { IVariable } from '../../../core/providers/domain/entities/IVariableProvider'
import React from 'react'
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard'

export const VariableAccordionDetail = ({
  variable,
}: {
  variable: IVariable
}) => {
  return (
    <AccordionDetails sx={{
      p: 1,
    
    }}>
      <Card variant='elevation' sx={{
        border: '1px solid #e0e0e0',
        padding: '0.5rem',
      }}>
        <Stack 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          p: 1,
        
        }}
        >
          <div>
            {variable.variable}
            <br />
            {variable.example}
          </div>
          <CopyToClipboard text={variable.variable} />
        </Stack>
      </Card>
    </AccordionDetails>
  )
}
