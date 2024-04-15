export interface User {
  id: string;
  name?: string;
  companyName?: string;
  position?: string;
  email?: string;
  contactNumber?: string;
  role?: string;
  employeeName?: string;
  supplierName?: string;
  verified?: number;
  [key: string]: any;
}
