/**
 * Rate- interface for rates in warehouse
 */

export interface Rate {
  id: number;
  warhouseid: number;
  toWarehouseid: number;
  toWarehouse: string;
  ratePerCubicFeet: number;
  ratePerKg: number;
}
