export abstract class UseCase<ReturnType, Props> {
  abstract call(params?: Props): Promise<ReturnType>;
}
