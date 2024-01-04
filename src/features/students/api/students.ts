import { API_ROUTES } from "@/shared/constants/appApiRoutes";
import { AxiosClient } from "@/shared/utils/AxiosClient";
import { HTTP_STATUS_CODES } from "@/shared/utils/app-enums";
import { IStudent } from "../types/IStudent";

export class StudentsApi {
    static fetchStudents = async (): Promise<{
        status: number;
        students?: IStudent[];
    }> =>{
        const result = await AxiosClient.get(API_ROUTES.STUDENTS.GET_ALL);
        const { status, data } = result;
        if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status };

        return { status, students: data.content as IStudent[] };
    }
    // static updateStudent = async (): Promise<{ status: number }> => {
    //     const result = await AxiosClient.put(API_ROUTES.STUDENTS.UPDATE);

    //     const { status } = result;

    //     if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status };

    //     return { status };
    // }

    static createStudent = async ( 
      data: Partial<IStudent>,
    ): Promise<{ status: number }> => {
      const result = await AxiosClient.post(API_ROUTES.STUDENTS.CREATE, data);
      const { status } = result;
      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) return { status }
      return { status }
    }

}