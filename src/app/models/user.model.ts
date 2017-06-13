export class User {
  public email: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public club: string;
  public clubFunction: string;
  public phone: string;
  private password: string;
  private confirmed: boolean;

  constructor() {}

  // tslint:disable-next-line:max-line-length
    //   constructor(_email: string, _firstName: string, _lastName: string, _username: string, _club: string, _clubFunction: string, _phone: string) {
    //     this.email = _email;
    //     this.firstName = _firstName;
    //     this.lastName = _lastName;
    //     this.username = _username;
    //     this.club = _club;
    //     this.clubFunction = _clubFunction;
    //     this.phone = _phone;
    //   }

}
