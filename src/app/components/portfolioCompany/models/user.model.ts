export class UserIds
{ 
  AppIdentifier: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  phoneNumber: string ;
  accessFailedCount: number =0;
  lockoutEnabled: boolean = true;
}