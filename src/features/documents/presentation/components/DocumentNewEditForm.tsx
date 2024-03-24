/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingButton from '@mui/lab/LoadingButton'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../../../../shared/sdk/hook-form'
import FormProvider from '../../../../shared/sdk/hook-form/form-provider'
import { Box, MenuItem } from '@mui/material'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentsForm } from '../hooks/useDocumentsForm'

type Props = {
  currentDocument?: DocumentModel
}

export const DocumentNewEditForm = ({ currentDocument }: Props) => {
  const mdUp = useResponsive('up', 'md')
  const {
    methods,
    councils,
    onSubmit,
    handleCouncilSelection,
    isCouncilSelected,
  } = useDocumentsForm(currentDocument)

  const { handleSubmit } = methods

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            El nombre del consejo, tipo, fecha y hora de inicio. Y si está
            activo o no
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre" required />

            <RHFSelect
              name="councilId"
              label="Consejo"
              className="w-full"
              placeholder="Consejo"
              onChange={(value: any) => {
                handleCouncilSelection(value)
              }}
            >
              {councils! &&
                councils.map((council) => (
                  <MenuItem
                    key={council.id as number}
                    value={council.id as number}
                  >
                    {council.name}
                  </MenuItem>
                ))}
            </RHFSelect>

            {isCouncilSelected && (
              <>
                <RHFSelect
                  name="process"
                  label="Proceso"
                  className="w-full"
                  placeholder="Proceso"
                  onChange={(value: any) => {
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
                      <MenuItem
                        key={process.id as number}
                        value={process.id as number}
                      >
                        {process.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
                {/* <Select
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
                    formik.setFieldValue('templateId', Number(value.currentKey))
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
                        formik.setFieldValue('functionariesIds', valueArray)
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
                        formik.touched.description && formik.errors.description
                          ? formik.errors.description
                          : ''
                      }
                    />
                  </>
                )} */}
              </>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  )

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Participantes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Se elijen
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>{!mdUp && <CardHeader title="Properties" />}</Card>
      </Grid>
    </>
  )

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch name="isActive" label="Documento activo" />
        </Box>

        <LoadingButton type="submit" variant="contained" size="large">
          {!currentDocument ? 'Crear' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  )
}
