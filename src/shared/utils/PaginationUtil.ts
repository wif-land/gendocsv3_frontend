export class PaginationParams {
  constructor(
    public page: number = 1,
    public rowsPerPage: number = 10,
    public orderBy: string = 'id',
    public order: 'asc' | 'desc' = 'asc',
  ) {}
}
