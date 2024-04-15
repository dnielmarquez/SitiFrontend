export interface NewUserData {
    name?: string;
    supplierName?: string; // Common field for both types of users
    companyName?: string; // Specific to one type, optional
    employeeName?: string; // Specific to another type, optional
    position: string; // Common field
    email: string; // Common field
    contactNumber: string; // Common field
    password: string; // Common field
    otp?: string; // Optional for both
    role?: string; // Role to distinguish between user types
}
