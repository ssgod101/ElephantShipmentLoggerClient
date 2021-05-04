import { Account } from '../account/account';

export interface Company {
  id: number;
  name: string;
  accounts: Account[];
}
