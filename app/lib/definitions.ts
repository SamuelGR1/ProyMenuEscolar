// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

// Nuevas definiciones para Menús

export type Menu = {
  id_menu: string; // ID del menú
  descripcion_menu: string; // Descripción del menú
  costo_total: number; // Costo total del menú
  fecha_creacion: string; // Fecha de creación en formato ISO
};

export type MenuForm = {
  id_menu: string; // ID del menú
  descripcion_menu: string; // Descripción del menú
  costo_total: number; // Costo total del menú
};

// Representación de los menús en la tabla
export type MenusTable = {
  id_menu: string; // ID del menú
  descripcion_menu: string; // Descripción del menú
  costo_total: number; // Costo total del menú
  fecha_creacion: string; // Fecha de creación en formato ISO
};

// Definición para MenuField
export type MenuField = {
  id_menu: string; 
  descripcion_menu: string;
  costo_total: number; 
  fecha_creacion: string; 
};




