import type { CityModel } from "./CityModel";

export interface UserProfileModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  city: CityModel | null; 
}
