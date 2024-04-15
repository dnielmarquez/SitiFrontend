export interface NewRequestData {
    createdByUserId: string;
    productName: 'VAULT' | 'COVER'; // Use your enum values here
    productRequirements: string;
    process: 'MACHINING' | 'COATING' | 'BOTH'; // Use your enum values here
    assignedSupplierIds: string[];
    assignmentDate: string; // ISO 8601 date string
    dueDate: string; // ISO 8601 date string
}
