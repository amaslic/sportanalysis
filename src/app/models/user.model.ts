export class User {
  public _id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public club: string;
  public clubFunction: string;
  public phone: string;
  private password: string;
  private confirmed: boolean;
  public coach: boolean;

  constructor() { }
}
