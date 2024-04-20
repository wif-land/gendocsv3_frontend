import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'
import { useEffect, useState } from 'react'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useDebounce } from '../../../../shared/hooks/use-debounce'
import { FunctionaryUseCasesImpl } from '../../../../features/functionaries/domain/usecases/FunctionaryServices'
import { StudentUseCasesImpl } from '../../../students/domain/usecases/StudentServices'
import { IFunctionary } from '../../../../features/functionaries/domain/entities/IFunctionary'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'
import { StudentModel } from '../../../../features/students/data/models/StudentModel'
import { FunctionaryModel } from '../../../../features/functionaries/data/models/FunctionatyModel'

export const useDefaultMembersV2 = () => {
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
        isStudent: false,
        secondName: 'Martin',
      },
    },
  ])

  const defaultValues = fetchedItems.map((item) => ({
    ...item,
    member: `${(item.member as IMember).firstName} ${
      (item.member as IMember).firstLastName
    } ${(item.member as IMember).secondLastName} - ${
      (item.member as IMember).dni
    }`,
    isStudent: (item.member as IMember).isStudent,
  }))
  const areThereChanges = useBoolean()
  const isEditMode = useBoolean()
  const isOpen = useBoolean()
  const [inputValue, setInputValue] = useState<string>('')
  const [members, setMembers] = useState<IMember[]>([])
  const [loading, setIsLoading] = useState(false)
  const debouncedValue = useDebounce(inputValue)
  const [formattedItems, setFormattedItems] = useState(defaultValues)

  const [addedMembers, setAddedMembers] = useState<IDefaultMembers[]>([])
  const [removedMembers, setRemovedMembers] = useState<IDefaultMembers[]>([])
  const [editedMembers, setEditedMembers] = useState<IDefaultMembers[]>([])
  const [positionOfSelectedMember, setPositionOfSelectedMember] = useState<
    number | null
  >(null)

  const schema = Yup.object().shape({
    member: Yup.string().required('Este campo es requerido'),
    positionName: Yup.string().required('Este campo es requerido'),
    isStudent: Yup.boolean(),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      member: '',
      positionName: '',
      isStudent: false,
    },
  })

  const handleAddMember = () => {
    const newMember = {
      member: methods.getValues('member'),
      positionName: methods.getValues('positionName'),
      order: formattedItems.length + 1,
      isStudent: methods.getValues('isStudent') as boolean,
    }

    if (
      formattedItems.some(
        (item) => item.positionName === newMember.positionName,
      )
    ) {
      alert('Ya existe un miembro con esa posición')
      return
    }

    setAddedMembers((prev) => [...prev, newMember])

    if (positionOfSelectedMember !== null && isEditMode.value === true) {
      const newItems = [...formattedItems]
      newItems.splice(positionOfSelectedMember, 0, {
        ...newMember,
        order: positionOfSelectedMember + 1,
      })
      setFormattedItems(newItems)
      return
    }

    setFormattedItems((prev) => [...prev, newMember])
  }

  const handleEditMember = (id: string) => {
    const editedMember = formattedItems.find(
      (item) => item.member.split('-')[1] === id,
    )
    methods.setValue('member', editedMember?.member as string)
    methods.setValue('positionName', editedMember?.positionName as string)
    setPositionOfSelectedMember(
      editedMember ? formattedItems.indexOf(editedMember) : null,
    )
    handleRemoveMember(id)
    isEditMode.onTrue()
  }

  const handleRemoveMember = (id: string) => {
    const memberIndex = formattedItems.findIndex(
      (item) => item.member.split('-')[1] === id,
    )
    const memberToRemove = formattedItems[memberIndex]

    if (addedMembers.includes(memberToRemove)) {
      setAddedMembers((prev) => prev.filter((item) => item !== memberToRemove))
    } else {
      if (editedMembers.includes(memberToRemove)) {
        setEditedMembers((prev) =>
          prev.filter((item) => item !== memberToRemove),
        )
      }
      setRemovedMembers((prev) => [...prev, memberToRemove])
    }
    setFormattedItems((prev) => prev.filter((item) => item !== memberToRemove))
  }

  const onSubmit = () => {
    isEditMode.value === true && isEditMode.onFalse()
    handleAddMember()
    methods.reset()
    setPositionOfSelectedMember(null)
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
      console.log(formattedItems[activeIndex].member)
      if (
        defaultValues.some(
          (defaultValue) =>
            defaultValue.member === formattedItems[activeIndex].member,
        ) &&
        !editedMembers.some(
          (editedMember) =>
            editedMember.member === formattedItems[activeIndex].member,
        )
      ) {
        setEditedMembers((prev) => [...prev, formattedItems[activeIndex]])
      }
      if (
        defaultValues.some(
          (defaultValue) =>
            defaultValue.member === formattedItems[overIndex].member,
        ) &&
        !editedMembers.some(
          (editedMember) =>
            editedMember.member === formattedItems[overIndex].member,
        )
      ) {
        setEditedMembers((prev) => [...prev, formattedItems[overIndex]])
      }

      const newItems = [...formattedItems]
      const activeItem = newItems.splice(activeIndex, 1)[0]

      newItems.splice(overIndex, 0, activeItem)

      newItems.forEach((item, index) => {
        item.order = index + 1
      })

      setFormattedItems(newItems)
    }
  }

  const handleDiscardChanges = () => {
    setFormattedItems(defaultValues)
    setAddedMembers([])
    setRemovedMembers([])
    setEditedMembers([])
    isEditMode.onFalse()
    areThereChanges.onFalse()
    methods.reset()
  }

  const sendData = () => {
    console.log('Agregados')
    console.log(addedMembers)
    console.log('Eliminados')
    console.log(removedMembers)
    console.log('Editados')
    console.log(editedMembers)
    console.log(formattedItems)
  }

  useEffect(() => {
    if (
      editedMembers.length > 0 ||
      addedMembers.length > 0 ||
      removedMembers.length > 0 ||
      isEditMode.value === true
    ) {
      areThereChanges.onTrue()
    }
  }, [addedMembers, removedMembers, isEditMode.value, editedMembers])

  useEffect(() => {
    let isMounted = true

    if (isOpen.value === false) return

    setIsLoading(true)

    if (
      debouncedValue.length === 0 ||
      debouncedValue === '' ||
      !debouncedValue
    ) {
      return
    }
    const fetchMembers = async () => {
      const isStudent = methods.getValues('isStudent')
      const UseCasesImpl = isStudent
        ? StudentUseCasesImpl
        : FunctionaryUseCasesImpl

      await UseCasesImpl.getInstance()
        .getByFilters({ field: debouncedValue })
        .then((res) => {
          if (isMounted) {
            const membersData = isStudent
              ? (res as { count: number; students: StudentModel[] }).students
              : (res as { count: number; functionaries: FunctionaryModel[] })
                  .functionaries
            filterAndSetMembers(membersData, isStudent as boolean)
          }
          setIsLoading(false)
        })
    }
    if (debouncedValue.includes('-')) return
    fetchMembers()

    return () => {
      isMounted = false
    }
  }, [debouncedValue, isOpen.value])

  const filterAndSetMembers = (
    membersToFilter: IFunctionary[] | IStudent[],
    isStudent: boolean,
  ) => {
    const currentMemberDNIs = new Set(
      formattedItems.map((item) => item.member.split('-')[1].trim()),
    )

    const filteredMembers = membersToFilter.filter(
      (member) => !currentMemberDNIs.has(member.dni.trim()),
    )

    setMembers(
      filteredMembers.map((member) => ({
        dni: member.dni,
        firstName: member.firstName,
        firstLastName: member.firstLastName,
        secondName: member.secondName,
        secondLastName: member.secondLastName,
        isStudent,
      })),
    )
  }

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
    isOpen,
    inputValue,
    setInputValue,
    loading,
    members,
    setMembers,
  }
}
