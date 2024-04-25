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

  const areThereChanges = useBoolean()
  const isEditMode = useBoolean()
  const isOpen = useBoolean()

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
    resolver: yupResolver(NewDefaultMemberSchema),
    defaultValues: resolveDefaultValues({} as IDefaultMembers),
  })

  const handleAddMember = () => {
    const newMember: IDefaultMembers = {
      member: methods.getValues('member') as string,
      positionName: methods.getValues('positionName'),
      positionOrder:
        isEditMode && positionOfSelectedMember !== null
          ? positionOfSelectedMember + 1
          : formattedItems.length + 1,
      isStudent: methods.getValues('isStudent'),
    }

    if (
      formattedItems.some(
        (item) => item.positionName === newMember.positionName,
      )
    ) {
      enqueueSnackbar('Ya existe un miembro con esa posición', {
        variant: 'error',
      })
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

  const handleEditMember = (id: number) => {
    const editedMember = formattedItems.find((item) => item.id === id)
    methods.setValue('member', editedMember?.member as string)
    methods.setValue('positionName', editedMember?.positionName as string)
    methods.setValue('isStudent', editedMember?.isStudent as boolean)
    setPositionOfSelectedMember(
      editedMember ? formattedItems.indexOf(editedMember) : null,
    )
    handleRemoveMember(id)
    isEditMode.onTrue()
  }

  const handleRemoveMember = (id: number) => {
    const memberIndex = formattedItems.findIndex((item) => item.id === id)
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
    handleAddMember()
    methods.reset()
    isEditMode.value && isEditMode.onFalse()
    setPositionOfSelectedMember(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active?.id !== over?.id) {
      const activeIndex = formattedItems.findIndex(
        (item) => item.id === active.id,
      )
      const overIndex = formattedItems.findIndex((item) => item.id === over.id)

      const hasMatch = defaultMembers.some(
        (defaultValue: any) =>
          defaultValue.id === formattedItems[activeIndex].id,
      )

      if (
        hasMatch &&
        !editedMembers.some(
          (editedMember) =>
            editedMember.member === formattedItems[activeIndex].member.id,
        )
      ) {
        setEditedMembers((prev) => [...prev, formattedItems[activeIndex]])
      }

      if (
        hasMatch &&
        !editedMembers.some(
          (editedMember) =>
            editedMember.member === formattedItems[overIndex].id,
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
    setFormattedItems(defaultMembers)
    upsertMembers([])
    setRemovedMembers([])
    setEditedMembers([])
    isEditMode.onFalse()
    areThereChanges.onFalse()
    methods.reset()
  }

  const sendData = async () => {
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
    handleDiscardChanges()
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

            filterAndSetMembers(membersData, isStudent)
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
      formattedItems.map((item) => item.member.dni),
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

  useEffect(() => {
    DefaultMembersUseCasesImpl.getInstance()
      .getByModuleId(moduleId)
      .then((res) => {
        1
        setDefaultMembers(
          res.map((member) => ({
            ...member,
            member: {
              ...member.member,
              label: `${member.member.firstName} ${member.member.firstLastName} ${member.member.secondLastName} - ${member.member.dni}`,
            },
          })),
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
