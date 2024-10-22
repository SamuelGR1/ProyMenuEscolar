// Tipos para usuarios
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  
  // Tipo para clientes (customers)
  export type Customer = {
    id_cliente: string; // Actualizado a id_cliente para coincidir con la tabla SQL
    name: string;
    email: string;
    image_url: string;
  };
  
  // Tipo para facturas
  export type Invoice = {
    id_factura: number; // SERIAL (número entero)
    cliente_id: number; // INT (referencia a clientes)
    fecha_factura: string; // TIMESTAMP en formato ISO
    total_factura: number; // DECIMAL (10, 2)
  };
  
  // Tipo para detalles de factura
  export type InvoiceDetail = {
    id_detalle_factura: number; // SERIAL (número entero)
    factura_id: number; // INT (referencia a facturas)
    menu_id: number; // INT (referencia a menus)
    costo_total: number; // DECIMAL (10, 2)
  };
  
  // Tipo para ingresos por mes
  export type Revenue = {
    month: string;
    revenue: number;
  };
  
  // Tipo para las facturas más recientes (vista simplificada)
  export type LatestInvoice = {
    id_factura: number; // Actualizado para coincidir con el campo en la tabla
    name: string;
    image_url: string;
    email: string;
    amount: string; // Se sigue formateando como cadena para la visualización
  };
  
  // El valor de 'amount' en bruto se almacena como número
  export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
    amount: number;
  };
  
  // Tipo para la tabla combinada de facturas y clientes
  export type InvoicesTable = {
    id_factura: number;
    cliente_id: number;
    name: string;
    email: string;
    image_url: string;
    fecha_factura: string;
    total_factura: number;
    status: 'pending' | 'paid';
  };
  
  // Tipo para las métricas de clientes (total de facturas, pagadas y pendientes)
  export type CustomersTableType = {
    id_cliente: number;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: number;
    total_paid: number;
  };
  
  // Tipo formateado para la tabla de clientes
  export type FormattedCustomersTable = {
    id_cliente: number;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: string;
    total_paid: string;
  };
  
  // Tipo para un campo de cliente usado en formularios (nombre y ID)
  export type CustomerField = {
    id_cliente: number;
    name: string;
  };
  
  // Tipo para formularios de factura (uso interno en la aplicación)
  export type InvoiceForm = {
    id_factura: number;
    cliente_id: number;
    total_factura: number;
    status: 'pending' | 'paid';
  };
  