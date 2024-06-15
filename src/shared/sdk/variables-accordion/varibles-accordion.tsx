import {
  Accordion,
  AccordionSummary,
  Chip,
  Divider,
  Stack,
} from '@mui/material'
import React from 'react'
import { VariableAccordionDetail } from '../variable-accordion-detail/variable-accordion-detail'
import { useVariables } from '../../../core/providers/variables-provider'
import { IVariable } from '../../../core/providers/domain/entities/IVariableProvider'

export const VariablesAccordion = () => {
  const { variables } = useVariables()
  return (
    <div>
      {Object.entries(variables).map(([key, value]) => {
        return (
          <Accordion key={key}>
            <AccordionSummary>
              <Chip label={key} variant="outlined" size="medium" />
            </AccordionSummary>
            <Divider />
            <Stack
              sx={{
                height: '400px ',
                overflowY: 'scroll',
              }}
            >
              {value.map((variable: IVariable) => {
                return (
                  <>
                    <VariableAccordionDetail
                      key={variable.variable}
                      variable={variable}
                    />
                  </>
                )
              })}
            </Stack>
          </Accordion>
        )
      })}
    </div>
  )
}
