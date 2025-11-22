
export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
}

export interface Client {
  id: string;
  fullName: string;
  docType: 'DNI' | 'PASAPORTE' | 'CE';
  docNumber: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Provider {
  id: string;
  companyName: string;
  serviceType: string; // Transport, Hotel, Guide
  contactName: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  maxPax: number;
  destinations: string[]; // e.g., ["Machu Picchu", "Sacred Valley"]
}

export interface Passenger {
  firstName: string;
  lastName: string;
  nationality: string;
  docType: 'DNI' | 'PASAPORTE';
  docNumber: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  YAPE = 'YAPE',
}

export interface Reservation {
  id: string; // Generated automatically
  reservationCode: string; // Visible code
  packageId: string;
  packageName?: string;
  package?: TourPackage;
  clientId: string; // The billing person
  clientName?: string;
  client?: Client;
  dateCreated: string;
  travelDate: string;
  adultCount: number;
  passengers: Passenger[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

// Theme Configuration Type
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  sidebarColor: string;
}