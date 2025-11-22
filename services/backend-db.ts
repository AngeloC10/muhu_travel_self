import {
  User, Client, Employee, Provider, TourPackage, Reservation, Passenger, PaymentMethod
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class BackendDatabaseService {
  private token: string | null = null;

  constructor() {
    const stored = localStorage.getItem('muhu_token');
    if (stored) {
      this.token = stored;
    }
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('muhu_token', token);
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
      localStorage.removeItem('muhu_token');
      localStorage.removeItem('muhu_session');
      this.token = null;
      throw new Error('Unauthorized - Please login again');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await this.request<{
        user: User;
        token: string;
      }>('POST', '/auth/login', { email, password });

      this.setToken(response.token);

      // Store user in session for compatibility
      localStorage.setItem('muhu_session', JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(name: string, email: string, password: string, adminPassword: string): Promise<User | null> {
    try {
      const response = await this.request<{
        user: User;
        token: string;
      }>('POST', '/auth/register', { name, email, password, adminPassword });

      this.setToken(response.token);
      localStorage.setItem('muhu_session', JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      console.error('Register error:', error);
      return null;
    }
  }

  async getProfile(): Promise<User | null> {
    try {
      return await this.request<User>('GET', '/auth/profile');
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // --- Users ---
  async getUsers(): Promise<User[]> {
    try {
      return await this.request<User[]>('GET', '/users');
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
    try {
      return await this.request<User>('POST', '/users', user);
    } catch (error) {
      console.error('Create user error:', error);
      return null;
    }
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    try {
      return await this.request<Client[]>('GET', '/clients');
    } catch (error) {
      console.error('Get clients error:', error);
      return [];
    }
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
    try {
      return await this.request<Client>('POST', '/clients', client);
    } catch (error) {
      console.error('Create client error:', error);
      return null;
    }
  }

  async upsertClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    try {
      return await this.request<Client>('POST', '/clients/upsert', clientData);
    } catch (error) {
      console.error('Upsert client error:', error);
      throw error;
    }
  }

  // --- Employees ---
  async getEmployees(): Promise<Employee[]> {
    try {
      return await this.request<Employee[]>('GET', '/employees');
    } catch (error) {
      console.error('Get employees error:', error);
      return [];
    }
  }

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
    try {
      return await this.request<Employee>('POST', '/employees', employee);
    } catch (error) {
      console.error('Create employee error:', error);
      return null;
    }
  }

  async updateEmployee(employee: Employee): Promise<Employee | null> {
    try {
      const { id, ...data } = employee;
      return await this.request<Employee>('PUT', `/employees/${id}`, data);
    } catch (error) {
      console.error('Update employee error:', error);
      return null;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/employees/${id}`);
      return true;
    } catch (error) {
      console.error('Delete employee error:', error);
      return false;
    }
  }

  async saveEmployee(employee: Partial<Employee> & { id?: string }): Promise<void> {
    if (employee.id) {
      await this.updateEmployee(employee as Employee);
    } else {
      await this.createEmployee(employee as Omit<Employee, 'id'>);
    }
  }

  // --- Providers ---
  async getProviders(): Promise<Provider[]> {
    try {
      return await this.request<Provider[]>('GET', '/providers');
    } catch (error) {
      console.error('Get providers error:', error);
      return [];
    }
  }

  async createProvider(provider: Omit<Provider, 'id'>): Promise<Provider | null> {
    try {
      return await this.request<Provider>('POST', '/providers', provider);
    } catch (error) {
      console.error('Create provider error:', error);
      return null;
    }
  }

  async updateProvider(provider: Provider): Promise<Provider | null> {
    try {
      const { id, ...data } = provider;
      return await this.request<Provider>('PUT', `/providers/${id}`, data);
    } catch (error) {
      console.error('Update provider error:', error);
      return null;
    }
  }

  async deleteProvider(id: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/providers/${id}`);
      return true;
    } catch (error) {
      console.error('Delete provider error:', error);
      return false;
    }
  }

  async saveProvider(provider: Partial<Provider> & { id?: string }): Promise<void> {
    if (provider.id) {
      await this.updateProvider(provider as Provider);
    } else {
      await this.createProvider(provider as Omit<Provider, 'id'>);
    }
  }

  // --- Packages ---
  async getPackages(): Promise<TourPackage[]> {
    try {
      return await this.request<TourPackage[]>('GET', '/packages');
    } catch (error) {
      console.error('Get packages error:', error);
      return [];
    }
  }

  async createPackage(pkg: Omit<TourPackage, 'id'>): Promise<TourPackage | null> {
    try {
      return await this.request<TourPackage>('POST', '/packages', pkg);
    } catch (error) {
      console.error('Create package error:', error);
      return null;
    }
  }

  async updatePackage(pkg: TourPackage): Promise<TourPackage | null> {
    try {
      const { id, ...data } = pkg;
      return await this.request<TourPackage>('PUT', `/packages/${id}`, data);
    } catch (error) {
      console.error('Update package error:', error);
      return null;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/packages/${id}`);
      return true;
    } catch (error) {
      console.error('Delete package error:', error);
      return false;
    }
  }

  async savePackage(pkg: Partial<TourPackage> & { id?: string }): Promise<void> {
    if (pkg.id) {
      await this.updatePackage(pkg as TourPackage);
    } else {
      await this.createPackage(pkg as Omit<TourPackage, 'id'>);
    }
  }

  // --- Reservations ---
  async getReservations(): Promise<Reservation[]> {
    try {
      return await this.request<Reservation[]>('GET', '/reservations');
    } catch (error) {
      console.error('Get reservations error:', error);
      return [];
    }
  }

  async createReservation(
    reservation: Omit<Reservation, 'id' | 'reservationCode'>
  ): Promise<Reservation | null> {
    try {
      return await this.request<Reservation>('POST', '/reservations', reservation);
    } catch (error) {
      console.error('Create reservation error:', error);
      return null;
    }
  }

  async updateReservation(
    id: string,
    updates: Partial<Reservation>
  ): Promise<Reservation | null> {
    try {
      return await this.request<Reservation>('PUT', `/reservations/${id}`, updates);
    } catch (error) {
      console.error('Update reservation error:', error);
      return null;
    }
  }

  async deleteReservation(id: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/reservations/${id}`);
      return true;
    } catch (error) {
      console.error('Delete reservation error:', error);
      return false;
    }
  }
}

export const db = new BackendDatabaseService();
