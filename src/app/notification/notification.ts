/**
 * notification- interface for notifications
 */
export interface Notification {
  id: number;
  companyid: number;
  companyidFrom: number;
  companyFrom: string;
  message: string;
  resolved: boolean;
  accepted: boolean;
  dateSent: Date;
}
