export interface Account {
  id: string;
  companyid: number;
  warehouseid: number;
  password: string;
  type: string;
  name: string;
  email: string;
  phonenumber: string;
  wage: number;
  wageunit: string;
  resetpassword: boolean;
}
