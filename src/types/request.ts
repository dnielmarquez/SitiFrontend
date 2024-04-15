export interface Request {
  id?: string;
  createdByUserId?: string;
  quantity?:number;
  productName?: 'VAULT' | 'COVER';
  productRequirements?: {};
  process?: string[];
  assignedSupplierIds?: string[];
  assignedSuppliers?: Supplier[];
  assignmentDate?: string | null;
  reviewedMachining?: string;
  reviewedCoating?: string;
  prevReviewedMachining?: string;
  prevReviewedCoating?: string;
  dueDate?: string | null;
  createdAt?: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
  status?: string;
  systemReview?: string;
  supplierThatChecked?: string;
  acceptanceRemarks?: string;
  acceptedBy?: string;
  acceptedByPosition?:string;
  dateChecked?: string;
  dateAccepted?: string;
  blockchainTx?: string;
  fileOnchainHash?: string;
}
