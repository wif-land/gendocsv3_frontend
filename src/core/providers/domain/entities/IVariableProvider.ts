export interface IVariableList {
  Posiciones: IVariable[]
  Estudiantes: IVariable[]
  Funcionarios: IVariable[]
  Consejos: IVariable[]
  Documentos: IVariable[]
  Actas_de_grado: IVariable[]
}

export interface IVariable {
  variable: string
  example: string
}