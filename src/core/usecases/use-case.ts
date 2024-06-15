/**
 * UseCase abstract class
 * 
 * @abstract
 * @class UseCase
 * @template ReturnType The return type of the call method
 * @template Props The parameters type of the call method
 */
export abstract class UseCase<ReturnType, Props> {
  abstract call(params?: Props): Promise<ReturnType>;
}
