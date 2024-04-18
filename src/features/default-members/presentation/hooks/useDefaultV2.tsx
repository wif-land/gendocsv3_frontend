import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'
import { useEffect, useState } from 'react'
import { useBoolean } from '../../../../shared/hooks/use-boolean'

export const useDefaultMembersV2 = () => {
  const areThereChanges = useBoolean()
  const isEditMode = useBoolean()

  const [fetchedItems] = useState<IDefaultMembers[]>([
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

  const [formattedItems, setFormattedItems] = useState(
    fetchedItems.map((item) => ({
      ...item,
      member: `${(item.member as IMember).firstName} ${
        (item.member as IMember).firstLastName
      } ${(item.member as IMember).secondLastName} - ${
        (item.member as IMember).dni
      }`,
    })),
  )

  const [addedMembers, setAddedMembers] = useState<IDefaultMembers[]>([])
  const [removedMembers, setRemovedMembers] = useState<IDefaultMembers[]>([])

  const schema = Yup.object().shape({
    member: Yup.string().required('Este campo es requerido'),
    positionName: Yup.string().required('Este campo es requerido'),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      member: '',
      positionName: '',
    },
  })

  const handleAddMember = () => {
    const newMember = {
      positionName: methods.getValues('positionName'),
      member: methods.getValues('member'),
      order: formattedItems.length + 1,
    }

    setAddedMembers((prev) => [...prev, newMember])
    setFormattedItems((prev) => [...prev, newMember])
  }

  const handleEditMember = (id: string) => {
    const editedMember = formattedItems.find(
      (item) => item.member.split('-')[1] === id,
    )
    methods.setValue('member', editedMember?.member as string)
    methods.setValue('positionName', editedMember?.positionName as string)
    handleRemoveMember(id)
    isEditMode.onTrue()
  }

  const handleRemoveMember = (id: string) => {
    const removedMember = formattedItems.find(
      (item) => item.member.split('-')[1] === id,
    )
    setFormattedItems((prev) =>
      prev.filter((item) => item.member.split('-')[1] !== id),
    )
    setRemovedMembers((prev) => [...prev, removedMember as IDefaultMembers])
  }

  const onSubmit = () => {
    isEditMode.value === true && isEditMode.onFalse()
    handleAddMember()
    methods.reset()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const activeIndex = formattedItems.findIndex(
        (item) => item.member.split('-')[1] === active.id,
      )
      const overIndex = formattedItems.findIndex(
        (item) => item.member.split('-')[1] === over.id,
      )
      const oldOrder = formattedItems[activeIndex].order
      const newOrder = formattedItems[overIndex].order

      const newItems = [...formattedItems]
      const [removed] = newItems.splice(activeIndex, 1)
      newItems.splice(overIndex, 0, removed)
      newItems[overIndex].order = newOrder
      newItems[activeIndex].order = oldOrder
      setFormattedItems(newItems)
    }
  }

  const handleDiscardChanges = () => {
    setFormattedItems(
      fetchedItems.map((item) => ({
        ...item,
        member: `${(item.member as IMember).firstName} ${
          (item.member as IMember).firstLastName
        } ${(item.member as IMember).secondLastName} - ${
          (item.member as IMember).dni
        }`,
      })),
    )
    setAddedMembers([])
    setRemovedMembers([])
    isEditMode.onFalse()
    areThereChanges.onFalse()
    methods.reset()
  }

  const sendData = () => {
    console.log(removedMembers)
    console.log(addedMembers)
    console.log(formattedItems)
  }

  useEffect(() => {
    if (
      addedMembers.length > 0 ||
      removedMembers.length > 0 ||
      isEditMode.value === true
    ) {
      areThereChanges.onTrue()
    }
  }, [addedMembers, removedMembers, isEditMode.value])

  return {
    ...methods,
    methods,
    handleAddMember,
    handleRemoveMember,
    onSubmit,
    handleDragEnd,
    formattedItems,
    sendData,
    areThereChanges,
    handleEditMember,
    handleDiscardChanges,
    isEditMode,
  }
}
