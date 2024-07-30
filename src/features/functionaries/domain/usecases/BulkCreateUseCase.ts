import { UseCase } from '../../../../core/usecases/use-case'
import { IFunctionary } from '../entities/IFunctionary'

export class BulkCreateUseCase extends UseCase<IFunctionary[], IFunctionary[]> {
  call(params: IFunctionary[]): Promise<IFunctionary[]> {
    console.log(params)

    return Promise.resolve([])
  }
}
