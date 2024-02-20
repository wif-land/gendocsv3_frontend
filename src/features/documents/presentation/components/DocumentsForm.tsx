/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useDocumentsForm } from '../hooks/useDocumentsForm'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { IDocument } from '../../domain/entities/IDocument'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import { useFunctionaryStore } from '../../../functionaries/presentation/state/useFunctionaryStore'
import { useCouncilStore } from '.././../../../features/council/presentation/store/councilsStore'
import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'
import { ProcessModel } from '../../../../features/processes/data/models/ProcessesModel'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { NumerationModel } from '../../data/models/NumerationModel'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
// import { TemplateModel } from '../../../../features/templates/data/models/TemplatesModel'

interface ProcessesFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  values?: IDocument
  isSubmitting?: boolean
}

export const DocumentsForm = ({
  isOpen,
  onOpenChange,
  values,
}: ProcessesFormProps) => {
  const { user } = useAccountStore()
  const isAddMode = !values?.id
  const { formik } = useDocumentsForm(values ?? ({} as IDocument), () =>
    onOpenChange(false),
  )
  const { students } = useStudentStore()
  const { functionaries } = useFunctionaryStore()
  const { councils } = useCouncilStore()
  const { processes } = useProcessStore()
  const [selectedProcess, setSelectedProcess] = useState<ProcessModel>()
  const [councilSelected, setCouncilSelected] = useState(false)
  const [templateSelected, setTemplateSelected] = useState(false)
  const [numbers, setNumbers] = useState<NumerationModel>()
  const {
    isOpen: isNumerationOpen,
    onOpen: onOpenNumeration,
    onOpenChange: onOpenChangeNumeration,
  } = useDisclosure()
  // const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel>()
  let studentFullName = ''
  let functionaryFullName = ''

  const handleCouncilSelection = async (value: any) => {
    if (value.size === 0) {
      setCouncilSelected(false)
      return
    }
    const { status, process } =
      await DocumentsUseCasesImpl.getInstance().getNumerationByCouncil(
        Number(value.currentKey),
      )
    if (status === HTTP_STATUS_CODES.OK) {
      setNumbers(process)
    }
    formik.setFieldValue('councilId', Number(value.currentKey))
    formik.setFieldValue('number', process.nextAvailableNumber)
    setCouncilSelected(true)
  }

  useEffect(() => {
    formik.setFieldValue('userId', Number(user?.id))
    if (isAddMode) return
    formik.setValues(values)
  }, [values, councilSelected])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        formik.resetForm()
        onOpenChange(false)
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isAddMode ? 'Crear documento' : 'Editar documento'}
            </ModalHeader>

            <form onSubmit={formik.handleSubmit}>
              {isAddMode ? (
                <ModalBody>
                  <Select
                    name="councilId"
                    label="Consejo"
                    className="w-full"
                    placeholder="Consejo"
                    variant="underlined"
                    onSelectionChange={(value: any) => {
                      handleCouncilSelection(value)
                    }}
                  >
                    {councils! &&
                      councils.map((council) => (
                        <SelectItem
                          key={council.id as number}
                          value={council.id as number}
                        >
                          {council.name}
                        </SelectItem>
                      ))}
                  </Select>
                  {councilSelected && (
                    <>
                      <Select
                        name="process"
                        label="Proceso"
                        className="w-full"
                        placeholder="Proceso"
                        variant="underlined"
                        onSelectionChange={(value: any) => {
                          setSelectedProcess(
                            processes?.find(
                              (process) =>
                                process.id?.toString() === value.currentKey,
                            ),
                          )
                        }}
                      >
                        {processes! &&
                          processes.map((process) => (
                            <SelectItem
                              key={process.id as number}
                              value={process.id as number}
                            >
                              {process.name}
                            </SelectItem>
                          ))}
                      </Select>
                      <Select
                        name="templateId"
                        label="Plantilla"
                        className="w-full"
                        placeholder="Plantilla"
                        variant="underlined"
                        onSelectionChange={(value: any) => {
                          if (value.size === 0) {
                            setTemplateSelected(false)
                            return
                          }
                          formik.setFieldValue(
                            'templateId',
                            Number(value.currentKey),
                          )
                          setTemplateSelected(true)
                        }}
                      >
                        {selectedProcess! &&
                          (selectedProcess?.templateProcesses || []).map(
                            (template) => (
                              <SelectItem
                                key={template.id as number}
                                value={template.id as number}
                              >
                                {template.name}
                              </SelectItem>
                            ),
                          )}
                      </Select>
                      {templateSelected && (
                        <>
                          <Modal
                            isOpen={isNumerationOpen}
                            onOpenChange={onOpenChangeNumeration}
                          >
                            <ModalContent>
                              {(onClose) => (
                                <>
                                  <ModalHeader className=" text-xl">
                                    Numeración
                                  </ModalHeader>
                                  <ModalBody>
                                    <h1 className="text-lg font-semibold">
                                      Número actual
                                    </h1>
                                    <p className="text-gray-500">
                                      {numbers?.nextAvailableNumber.toString()}
                                    </p>
                                    <h1 className="text-lg font-semibold">
                                      Números Reservados
                                    </h1>
                                    <p className="text-gray-500">
                                      {numbers!.reservedNumbers.length > 0
                                        ? numbers?.reservedNumbers.toString()
                                        : 'Sin numeros reservados'}
                                    </p>
                                    <h1 className="text-lg font-semibold">
                                      Números encolados
                                    </h1>
                                    <p className="text-gray-500">
                                      {numbers!.enqueuedNumbers.length > 0
                                        ? numbers?.enqueuedNumbers.toString()
                                        : 'Sin numeros encolados'}
                                    </p>
                                    <h1 className="text-lg font-semibold">
                                      Números utilizados
                                    </h1>
                                    <p className="text-gray-500">
                                      {numbers!.usedNumbers.length > 0
                                        ? numbers?.usedNumbers.toString()
                                        : 'Sin numeros utilizados'}
                                    </p>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      color="danger"
                                      variant="light"
                                      onPress={onClose}
                                    >
                                      Close
                                    </Button>
                                    <Button color="primary" onPress={onClose}>
                                      Action
                                    </Button>
                                  </ModalFooter>
                                </>
                              )}
                            </ModalContent>
                          </Modal>
                          <div className="flex gap-4 items-end">
                            <Input
                              id="number"
                              name="number"
                              type="number"
                              label="Número"
                              variant="underlined"
                              className="w-full flex-1"
                              defaultValue={numbers?.nextAvailableNumber.toString()}
                              // value={formik.values.number.toString()}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              size="lg"
                              errorMessage={
                                formik.touched.number && formik.errors.number
                                  ? formik.errors.number
                                  : ''
                              }
                            />
                            <Button
                              color="primary"
                              variant="solid"
                              className="flex-3"
                              onClick={() => {
                                onOpenNumeration()
                              }}
                            >
                              Numeración
                            </Button>
                          </div>
                          <Autocomplete
                            name="studentId"
                            label="Estudiante"
                            className="w-full"
                            placeholder="Estudiante"
                            variant="underlined"
                            onSelectionChange={(value) => {
                              formik.setFieldValue('studentId', Number(value))
                            }}
                          >
                            {students! &&
                              students.map(
                                (student) => (
                                  (studentFullName = `${student.firstLastName} ${student.secondLastName} ${student.firstName} ${student.secondName} | ${student.dni}`),
                                  (
                                    <AutocompleteItem
                                      key={student.id}
                                      value={student.id}
                                    >
                                      {studentFullName}
                                    </AutocompleteItem>
                                  )
                                ),
                              )}
                          </Autocomplete>
                          <Select
                            selectionMode="multiple"
                            name="functionariesIds"
                            label="Funcionarios"
                            className="w-full"
                            placeholder="Funcionarios"
                            variant="underlined"
                            onSelectionChange={(value) => {
                              const valueArray: number[] =
                                Array.from(value).map(Number)
                              formik.setFieldValue(
                                'functionariesIds',
                                valueArray,
                              )
                            }}
                          >
                            {functionaries! &&
                              functionaries.map(
                                (functionaries) => (
                                  (functionaryFullName = `${functionaries.firstLastName} ${functionaries.secondLastName} ${functionaries.firstName} ${functionaries.secondName} | ${functionaries.dni}`),
                                  (
                                    <SelectItem
                                      key={functionaries.id!}
                                      value={functionaries.id}
                                    >
                                      {functionaryFullName}
                                    </SelectItem>
                                  )
                                ),
                              )}
                          </Select>
                          <Textarea
                            id="description"
                            name="description"
                            type="textarea"
                            label="Descripción"
                            variant="underlined"
                            className="w-full"
                            value={formik.values.description.toString()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            size="lg"
                            errorMessage={
                              formik.touched.description &&
                              formik.errors.description
                                ? formik.errors.description
                                : ''
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </ModalBody>
              ) : (
                <ModalBody>
                  <Textarea
                    id="description"
                    name="description"
                    type="textarea"
                    label="Descripción"
                    variant="underlined"
                    className="w-full"
                    value={formik.values.description.toString()}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    errorMessage={
                      formik.touched.description && formik.errors.description
                        ? formik.errors.description
                        : ''
                    }
                  />
                </ModalBody>
              )}

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setCouncilSelected(false)
                    setTemplateSelected(false)
                    setNumbers(undefined)
                    formik.resetForm()
                    onClose()
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  color="primary"
                  isDisabled={formik.isSubmitting}
                  type="submit"
                >
                  {isAddMode ? 'Crear' : 'Editar'}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
