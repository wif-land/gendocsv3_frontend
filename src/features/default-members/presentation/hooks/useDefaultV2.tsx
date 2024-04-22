/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form'
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
import { enqueueSnackbar } from 'notistack'
import {
  ACTIONS,
  NewDefaultMemberSchema,
  resolveDefaultValues,
} from '../constants'
import { DefaultMembersUseCasesImpl } from '../../domain/usecases/DefaultMemberServices'
import { DefaultMemberModel } from '../../data/models/DefaultMembersModel'
import { useParams } from 'next/navigation'
import { resolveModuleId } from '../../../../shared/utils/ModuleUtil'
import useModulesStore from '../../../../shared/store/modulesStore'
import { useDefaultMembersStore } from '../store/defaultMembersStore'

export const useDefaultMembersView = () => {
  const { codeModule } = useParams()
  const moduleId = resolveModuleId(
    useModulesStore().modules,
    codeModule as string,
  )
  const { defaultMembers, setDefaultMembers } = useDefaultMembersStore()

  useEffect(() => {
    DefaultMembersUseCasesImpl.getInstance()
      .getByModuleId(moduleId)
      .then((res) => {
        setDefaultMembers(
          res.map((member) => DefaultMemberModel.fromJson(member)),
        )
        setFormattedItems(
          res.map((member) => ({
            ...member,
            member: {
              id: member.member.id,
              label: `${member.member.firstName} ${member.member.firstLastName} ${member.member.secondLastName} - ${member.member.dni}`,
            },
          })),
        )
      })
  }, [])

  // const [fetchedItems] = useState<IDefaultMembers[]>([
  //   // {
  //   //   positionName: 'Developer',
  //   //   positionOrder: 1,
  //   //   isStudent: true,
  //   //   member: {
  //   //     dni: '12345678A',
  //   //     firstName: 'John',
  //   //     secondLastName: 'Villa',
  //   //     firstLastName: 'Doe',
  //   //     secondName: 'Martin',
  //   //     isStudent: false,
  //   //   },
  //   // },
  // ])

  const defaultValues = ([] as any).map((item: any) => ({
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
  const isStudent = useBoolean()

  const [inputValue, setInputValue] = useState<string>('')
  const [members, setMembers] = useState<IMember[]>([])
  const [loading, setIsLoading] = useState(false)
  const [formattedItems, setFormattedItems] = useState<any[]>([])
  const [upserttedMembers, upsertMembers] = useState<IDefaultMembers[]>([])
  const [removedMembers, setRemovedMembers] = useState<IDefaultMembers[]>([])
  const [editedMembers, setEditedMembers] = useState<IDefaultMembers[]>([])
  const [positionOfSelectedMember, setPositionOfSelectedMember] = useState<
    number | null
  >(null)

  const debouncedValue = useDebounce(inputValue)

  const methods = useForm({
    // @ts-expect-error - This is a known issue with the library
    resolver: yupResolver(NewDefaultMemberSchema),
    defaultValues: resolveDefaultValues({} as IDefaultMembers),
  })

  const handleAddMember = () => {
    const newMember: IDefaultMembers = {
      member: methods.getValues('member') as string,
      positionName: methods.getValues('positionName'),
      positionOrder: formattedItems.length + 1,
      isStudent: methods.getValues('isStudent'),
    }

    if (
      formattedItems.some(
        (item) => item.positionName === newMember.positionName,
      )
    ) {
      enqueueSnackbar('Ya existe un miembro con esa posición')
      return
    }

    upsertMembers((prev) => [...prev, newMember])

    if (positionOfSelectedMember !== null && isEditMode.value) {
      const newItems = [...formattedItems]
      newItems.splice(positionOfSelectedMember, 0, {
        ...newMember,
        positionOrder: positionOfSelectedMember + 1,
      } as any)
      setFormattedItems(newItems)
      return
    }

    setFormattedItems((prev) => [...prev, newMember as any])
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

    if (upserttedMembers.includes(memberToRemove)) {
      upsertMembers((prev) => prev.filter((item) => item !== memberToRemove))
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
    isEditMode.value && isEditMode.onFalse()
    handleAddMember()
    methods.reset()
    setPositionOfSelectedMember(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const activeIndex = formattedItems.findIndex(
        (item) => item.id === active.id,
      )
      const overIndex = formattedItems.findIndex((item) => item.id === over.id)

      if (
        defaultValues.some(
          (defaultValue: any) =>
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
          (defaultValue: any) =>
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
        item.positionOrder = index + 1
      })

      setFormattedItems(newItems)
    }
  }

  const handleDiscardChanges = () => {
    setFormattedItems(defaultValues)
    upsertMembers([])
    setRemovedMembers([])
    setEditedMembers([])
    isEditMode.onFalse()
    areThereChanges.onFalse()
    methods.reset()
  }

  const sendData = async () => {
    console.log('Agregados')
    console.log(upserttedMembers)

    console.log('Eliminados')
    console.log(removedMembers)

    console.log('Editados')
    console.log(editedMembers)
    console.log(formattedItems)

    await DefaultMembersUseCasesImpl.getInstance().createOrEditByModuleId(
      moduleId,
      [
        ...upserttedMembers.map((member) => ({
          ...member,
          member: (member.member as IMember).id,
          action: ACTIONS.CREATE,
        })),
        ...editedMembers.map((member) => ({
          ...member,
          member: (member.member as IMember).id,
          action: ACTIONS.UPDATE,
        })),
        ...removedMembers.map((member) => ({
          ...member,
          member: '',
          action: ACTIONS.DELETE,
        })),
      ].map((member) => DefaultMemberModel.fromJson(member)),
    )
  }

  useEffect(() => {
    if (
      editedMembers.length > 0 ||
      upserttedMembers.length > 0 ||
      removedMembers.length > 0 ||
      isEditMode.value === true
    ) {
      areThereChanges.onTrue()
    }
  }, [upserttedMembers, removedMembers, isEditMode.value, editedMembers])

  useEffect(() => {
    let isMounted = true

    if (!isOpen.value) return

    setIsLoading(true)

    if (
      debouncedValue.length === 0 ||
      debouncedValue === '' ||
      !debouncedValue
    ) {
      return
    }

    const fetchMembers = async () => {
      // TODO: Implement strategy pattern
      const UseCasesImpl = isStudent.value
        ? StudentUseCasesImpl
        : FunctionaryUseCasesImpl

      await UseCasesImpl.getInstance()
        .getByFilters({ field: debouncedValue })
        .then((res) => {
          if (isMounted) {
            const membersData = isStudent.value
              ? (res as { count: number; students: StudentModel[] }).students
              : (res as { count: number; functionaries: FunctionaryModel[] })
                  .functionaries

            filterAndSetMembers(membersData, isStudent.value)
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
        ...member,
        isStudent,
      })),
    )
  }

  return {
    defaultMembers,
    ...methods,
    methods,
    formattedItems,
    areThereChanges,
    isEditMode,
    isOpen,
    inputValue,
    loading,
    members,
    handleAddMember,
    handleRemoveMember,
    onSubmit,
    handleDragEnd,
    sendData,
    handleEditMember,
    handleDiscardChanges,
    setInputValue,
    setMembers,
  }
}
