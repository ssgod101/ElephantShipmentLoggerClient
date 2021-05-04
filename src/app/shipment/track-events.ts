/**
 * trackEvents- interface for trackEvents
 */
export interface TrackEvents {
  id: number;
  shipmentid: string;
  time: string;
  date: string;
  currentWarehouse: string;
  currentWarehouseid: number;
  reached: boolean;
}
