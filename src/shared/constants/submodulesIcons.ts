// submodulesIcons.js

import { PiStudent,PiSquaresFour,PiBuildings ,PiUserRectangle,PiGraduationCap, PiFolders,  PiUsersFour, PiUser, PiToolbox, PiArrowsClockwise, PiReadCvLogo} from "react-icons/pi";
import { LiaSearchSolid } from "react-icons/lia"

export const defaultIcon = PiSquaresFour;

export type IconType = typeof PiArrowsClockwise


interface ISubmoduleIcons {
  [key: string]: IconType | undefined; // Agrega una firma de índice aquí
}


export const submoduleIcons  : ISubmoduleIcons = {
  Buscar: LiaSearchSolid ,
  Consejos: PiUsersFour,
  Procesos: PiArrowsClockwise,
  Documentos: PiReadCvLogo,
  Estudiantes: PiStudent,
  Funcionarios: PiUserRectangle,
  Carreras: PiBuildings,
  Usuarios: PiUser,
  'Actas de Grado': PiGraduationCap,
  Historial: PiFolders,
  Cargos: PiToolbox,
};


