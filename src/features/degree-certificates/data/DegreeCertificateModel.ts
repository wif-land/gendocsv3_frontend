export class DegreeCertificateModel {
  constructor(
    public id: number,
    public name: string,
    public isActive: boolean,
    public date: Date,
  ) {}
}
