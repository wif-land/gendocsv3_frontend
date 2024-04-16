import { Button, Container } from '@mui/material'
import React, { useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IDefaultMembers, IMember } from '../../domain/entities/DefaultMembers'
import { DefaultMemberSortableItem } from './DefaultMemberSortableItem'

const DefaultMembersView: React.FC = () => {
  const [items, setItems] = useState<IDefaultMembers[]>([
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.member.dni === active.id)
      const newIndex = items.findIndex((item) => item.member.dni === over.id)

      const newItems = [...items]
      const [removed] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, removed)
      setItems(newItems)
    }
  }

  const handleUpdate = (id: string, updatedUser: IMember) => {
    const index = items.findIndex((item) => item.member.dni === id)
    if (index !== -1) {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], member: updatedUser }
      setItems(newItems)
    }
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.member.dni !== id))
  }

  const handleAdd = () => {
    const newUser = {
      positionName: '',
      order: items.length + 1,
      member: {
        dni: '',
        firstName: '',
        secondLastName: '',
        firstLastName: '',
        secondName: '',
        isStudent: true,
      },
    }

    setItems([...items, newUser as IDefaultMembers])
  }

  return (
    <Container>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <h1>Listado</h1>
        <Button onClick={handleAdd} style={{ marginBottom: 16 }}>
          Agregar Nuevo
        </Button>

        <SortableContext
          items={items.map((item) => item.member.dni)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {items.map((item) => (
              <DefaultMemberSortableItem
                user={item.member}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                key={item.member.dni}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </Container>
  )
}

export default DefaultMembersView
