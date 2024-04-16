import { useSortable } from '@dnd-kit/sortable'
import { IMember } from '../../domain/entities/DefaultMembers'
import { CSS } from '@dnd-kit/utilities'

import { TextField, Button, Input } from '@mui/material'
import { useState } from 'react'

export const DefaultMemberSortableItem = ({
  user,
  onUpdate,
  onDelete,
}: {
  user: IMember
  onUpdate: (id: string, field: keyof IMember, value: string) => void
  onDelete: (id: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.dni })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Manejar estado local para los inputs
  const [firstName, setFirstName] = useState(user.firstName)
  const [secondLastName, setSecondLastName] = useState(user.secondLastName)

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstName(event.target.value)
    onUpdate(user.dni, 'firstName', event.target.value)
  }

  const handleSecondLastNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSecondLastName(event.target.value)
    onUpdate(user.dni, 'secondLastName', event.target.value)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={user.dni}
    >
      <Input name="name" onChange={handleFirstNameChange} />
      <TextField
        label="Cargo"
        defaultValue={secondLastName}
        onChange={handleSecondLastNameChange}
        variant="outlined"
        style={{ marginRight: 8 }}
      />
      <Button onClick={() => onDelete(user.dni)}>Eliminar</Button>
    </div>
  )
}
