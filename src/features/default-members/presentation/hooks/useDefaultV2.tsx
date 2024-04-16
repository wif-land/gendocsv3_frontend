import { useForm, useFieldArray } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'
import { useState } from 'react'

export const useDefaultMembersV2 = () => {
  const [items] = useState<IDefaultMembers[]>([
    {
      positionName: 'Developer',
      order: 1,
      member: {
        dni: '12345678A',
        firstName: 'John',
        secondLastName: 'Villa',
        firstLastName: 'Doe',
        isStudent: true,
        secondName: 'Martin',
      },
    },
    {
      positionName: 'Developer',
      order: 2,
      member: {
        dni: '1850046317',
        firstName: 'Martin',
        secondLastName: 'Morales',
        firstLastName: 'Doe',
        isStudent: true,
        secondName: 'Martin',
      },
    },
  ])

  const schema = Yup.object().shape({
    members: Yup.array().of(
      Yup.object().shape({
        order: Yup.number().required(),
        positionName: Yup.string().required(),
        member: Yup.mixed().required(),
      }),
    ),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      members: items.map((item) => ({
        order: item.order,
        positionName: item.positionName,
        member: `${(item.member as IMember).firstName} ${
          (item.member as IMember).secondName
        } ${(item.member as IMember).firstLastName || ''} ${
          (item.member as IMember).secondLastName || ''
        } - ${(item.member as IMember).dni || ''} `,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'members',
  })

  const handleAddMember = () => {
    append({ order: fields.length + 1, positionName: '', member: '' })
  }

  const handleRemoveMember = (index: string) => {
    // buscar el index del elemento a eliminar
    console.log(index)
    const indexToRemove = fields.findIndex((field) => field.id === index)
    console.log(indexToRemove)
    remove(indexToRemove)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id)
      const newIndex = fields.findIndex((item) => item.id === over.id)
      const oldOrder = fields[oldIndex].order
      const newOrder = fields[newIndex].order

      fields[oldIndex].order = newOrder
      fields[newIndex].order = oldOrder

      const newFields = [...fields]
      newFields[oldIndex] = fields[newIndex]
      newFields[newIndex] = fields[oldIndex]
      methods.setValue('members', newFields)
    }
  }

  return {
    ...methods,
    methods,
    fields,
    handleAddMember,
    handleRemoveMember,
    onSubmit,
    handleDragEnd,
  }
}
