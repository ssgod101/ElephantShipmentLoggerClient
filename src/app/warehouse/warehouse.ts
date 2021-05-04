/**
 * warehouse- interface for warehouse
 */
import {Rate} from './rate';

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  companyid: number;
  rates: Rate[];
}
