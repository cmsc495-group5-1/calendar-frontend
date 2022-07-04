import Calendar from "./Calendar";

export default class User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  calendars: Calendar[];

  constructor(email: string, firstName: string, lastName: string, calendars: Calendar[] | undefined = undefined) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.calendars = calendars || [];
  }
}

export class UserLoginFormSubmission {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class UserCreationFormSubmission {
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  passwordConfirm!: string;
}