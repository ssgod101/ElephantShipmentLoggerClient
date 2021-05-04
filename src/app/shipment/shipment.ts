/**
 * shipment- interface for shipments
 */
import {Products} from './products';
import {TrackEvents} from './track-events';

export interface Shipment {
id: string;
companyid: number;
senderName: string;
receiverName: string;
senderPhone: string;
receiverPhone: string;
cityStart: string;
cityEnd: string;
products: Products[];
length: number;
width: number;
height: number;
weight: number;
description: string;
hazardLevel: string;
dateSent: string;
dateArrived: string;
vehicleNumber: string;
trackEvents: TrackEvents[];
warehouseFromid: number;
warehouseToid: number;
paid: boolean;
beginAddress: string;
afterAddress: string;
gst: string;
amount: number;
qrcode: string;
qrcodetxt: string;
}
