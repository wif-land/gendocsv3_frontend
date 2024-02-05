/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from 'react'
import { DayPicker, DropdownProps } from 'react-day-picker'
import { Select, SelectItem } from '@nextui-org/react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = ({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) => (
  <DayPicker
    defaultMonth={new Date()}
    showOutsideDays={showOutsideDays}
    className={`p-3 ${className}`}
    classNames={{
      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
      month: 'space-y-4',
      caption: 'flex justify-center pt-1 relative items-center',
      ['caption_label']: 'text-sm font-medium',
      ['caption_dropdowns']: 'flex justify-center gap-1',
      nav: 'space-x-1 flex items-center',
      ['nav_button']:
        'flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none border-medium bg-transparent text-tiny gap-unit-2 rounded-small px-unit-0 !gap-unit-0 transition-transform-colors-opacity motion-reduce:transition-none border-default text-default-foreground hover:!bg-default min-w-unit-8 w-unit-8 h-unit-8',
      ['nav_button_previous']: 'absolute left-1',
      ['nav_button_next']: 'absolute right-1',
      table: 'w-full border-collapse space-y-1',
      ['head_row']: 'flex',
      ['head_cell']:
        'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
      row: 'flex w-full mt-2',
      cell: 'text-center rounded-small text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
      day: 'hover:bg-accent hover:text-accent-foreground rounded-small h-9 w-9 p-0 font-normal aria-selected:opacity-100',
      ['day_selected']:
        'bg-primary rounded-small text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      ['day_today']: 'bg-accent text-accent-foreground',
      ['day_outside']: 'text-muted-foreground opacity-50',
      ['day_disabled']: 'text-muted-foreground opacity-50',
      ['day_range_middle']:
        'aria-selected:bg-accent aria-selected:text-accent-foreground',
      ['day_hidden']: 'invisible',
      ...classNames,
    }}
    components={{
      Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
        const options = React.Children.toArray(children) as React.ReactElement<
          React.HTMLProps<HTMLOptionElement>
        >[]
        const [selectedValue, setSelectedValue] = React.useState<string>('')
        const handleSelectionChange = (
          e: React.ChangeEvent<HTMLSelectElement>,
        ) => {
          setSelectedValue(e.target.value)
          onChange?.(e)
        }
        React.useEffect(() => {
          for (let index = 0; index < options.length; index++) {
            const element = options[index]
            if (element.props.value === value) {
              setSelectedValue(element.props.value!.toString())
            }
          }
        }, [])

        return (
          <Select
            size="sm"
            className="flex w-[130px]"
            aria-label={props['aria-label']}
            selectedKeys={selectedValue === '' ? [] : [selectedValue]}
            onChange={handleSelectionChange}
          >
            {options.map((option, id: number) => (
              <SelectItem
                key={option.props.value as string}
                value={option.props.value as string}
              >
                {option.props.children}
              </SelectItem>
            ))}
          </Select>
        )
      },
      IconLeft: ({ ...props }) => <MdChevronLeft className="h-4 w-4" />,
      IconRight: ({ ...props }) => <MdChevronRight className="h-4 w-4" />,
    }}
    {...props}
  />
)
Calendar.displayName = 'Calendar'

export { Calendar }
