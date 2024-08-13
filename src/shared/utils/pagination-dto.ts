export class PaginationDTO {
  constructor(
    public page: number = 1,
    public limit: number = 10,
  ) {}
}
